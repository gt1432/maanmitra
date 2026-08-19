import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB

# Add parent directory to path if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.preprocessing import clean_text
from ml.evaluation import compute_model_metrics, save_metrics_to_json

def train_nlp_pipeline():
    print("=== PIPELINE B: NLP TEXT CLASSIFICATION TRAINING ===")
    data_path = os.path.join("maanmitra", "data", "mental_heath_unbanlanced.csv")
    
    if not os.path.exists(data_path):
        data_path = os.path.join("data", "mental_heath_unbanlanced.csv")
        
    print(f"Loading text dataset from: {data_path}")
    df = pd.read_csv(data_path)
    
    # Drop missing values
    df = df.dropna(subset=['text', 'status'])
    
    print(f"Total dataset size: {len(df)} samples")
    
    # Clean text
    print("Cleaning text samples...")
    df['cleaned_text'] = df['text'].apply(clean_text)
    
    # Drop empty cleaned text
    df = df[df['cleaned_text'].str.strip() != '']
    
    X = df['cleaned_text']
    y = df['status']
    labels = sorted(list(y.unique()))
    
    print(f"Unique emotion/status classes: {labels}")
    
    # Train / Test split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train)} samples | Testing set: {len(X_test)} samples")
    
    # TF-IDF Vectorization
    print("Performing TF-IDF Vectorization...")
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Models to train and compare
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Linear SVM": LinearSVC(random_state=42, dual='auto'),
        "Naive Bayes": MultinomialNB()
    }
    
    comparison_metrics = {}
    best_model_name = None
    best_f1 = -1.0
    best_model = None
    
    for name, model in models.items():
        print(f"\nTraining model: {name}...")
        model.fit(X_train_vec, y_train)
        y_pred = model.predict(X_test_vec)
        
        metrics = compute_model_metrics(y_test, y_pred, labels=labels)
        print(f"--> {name} Results | Accuracy: {metrics['accuracy']} | F1-Score: {metrics['f1_score']}")
        
        comparison_metrics[name] = metrics
        
        if metrics['f1_score'] > best_f1:
            best_f1 = metrics['f1_score']
            best_model_name = name
            best_model = model
            
    print(f"\n==========================================")
    print(f"BEST NLP MODEL: {best_model_name} (F1 Score: {best_f1})")
    print(f"==========================================")
    
    # Save artifacts
    models_dir = os.path.join("maanmitra", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_save_path = os.path.join(models_dir, "nlp_model.pkl")
    vec_save_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
    metrics_save_path = os.path.join(models_dir, "nlp_metrics.json")
    
    joblib.dump(best_model, model_save_path)
    joblib.dump(vectorizer, vec_save_path)
    
    final_output = {
        "dataset_size": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "labels": labels,
        "best_model": best_model_name,
        "models_comparison": comparison_metrics
    }
    
    save_metrics_to_json(final_output, metrics_save_path)
    print(f"Saved NLP model to: {model_save_path}")
    print(f"Saved TF-IDF Vectorizer to: {vec_save_path}")
    print(f"Saved NLP Metrics JSON to: {metrics_save_path}")
    
    return final_output

if __name__ == "__main__":
    train_nlp_pipeline()
