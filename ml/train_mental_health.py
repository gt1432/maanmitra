import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.preprocessing import preprocess_student_mental_health
from ml.evaluation import compute_model_metrics, save_metrics_to_json

def train_mental_health_pipeline():
    print("=== PIPELINE A: STUDENT MENTAL HEALTH ML MODEL TRAINING ===")
    data_path = os.path.join("maanmitra", "data", "Student Mental health.csv")
    
    if not os.path.exists(data_path):
        data_path = os.path.join("data", "Student Mental health.csv")
        
    print(f"Loading Student Mental Health dataset from: {data_path}")
    df_raw = pd.read_csv(data_path)
    print(f"Total raw dataset size: {len(df_raw)} samples")
    
    # Preprocess dataset
    df, feature_cols, target_col = preprocess_student_mental_health(df_raw)
    
    X = df[feature_cols]
    y = df[target_col]
    labels = sorted(list(y.unique()))
    
    print(f"Target distress levels: {labels}")
    print(f"Feature columns used: {feature_cols}")
    
    # Train / Test split (80% train / 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train)} samples | Testing set: {len(X_test)} samples")
    
    # Models to compare
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    comparison_metrics = {}
    best_model_name = None
    best_f1 = -1.0
    best_model = None
    
    for name, model in models.items():
        print(f"\nTraining model: {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        metrics = compute_model_metrics(y_test, y_pred, labels=labels)
        print(f"--> {name} Results | Accuracy: {metrics['accuracy']} | F1-Score: {metrics['f1_score']}")
        
        comparison_metrics[name] = metrics
        
        if metrics['f1_score'] > best_f1:
            best_f1 = metrics['f1_score']
            best_model_name = name
            best_model = model
            
    print(f"\n==========================================")
    print(f"BEST MENTAL HEALTH ML MODEL: {best_model_name} (F1 Score: {best_f1})")
    print(f"==========================================")
    
    # Save artifacts
    models_dir = os.path.join("maanmitra", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_save_path = os.path.join(models_dir, "mental_health_model.pkl")
    metrics_save_path = os.path.join(models_dir, "mental_health_metrics.json")
    
    # Save model along with feature metadata for inference
    saved_bundle = {
        'model': best_model,
        'feature_cols': feature_cols
    }
    
    joblib.dump(saved_bundle, model_save_path)
    
    final_output = {
        "dataset_size": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "labels": labels,
        "best_model": best_model_name,
        "models_comparison": comparison_metrics
    }
    
    save_metrics_to_json(final_output, metrics_save_path)
    print(f"Saved Mental Health model to: {model_save_path}")
    print(f"Saved Mental Health Metrics JSON to: {metrics_save_path}")
    
    return final_output

if __name__ == "__main__":
    train_mental_health_pipeline()
