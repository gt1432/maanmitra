import json
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

def compute_model_metrics(y_true, y_pred, labels=None):
    """
    Compute comprehensive metrics for classification models.
    """
    acc = float(accuracy_score(y_true, y_pred))
    prec, rec, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    
    if labels is None:
        labels = sorted(list(set(y_true)))
        
    return {
        'accuracy': round(acc, 4),
        'precision': round(float(prec), 4),
        'recall': round(float(rec), 4),
        'f1_score': round(float(f1), 4),
        'confusion_matrix': cm.tolist(),
        'labels': [str(lbl) for lbl in labels]
    }

def save_metrics_to_json(metrics_dict, filepath):
    """
    Save evaluation metrics to JSON format.
    """
    with open(filepath, 'w') as f:
        json.dump(metrics_dict, f, indent=2)
