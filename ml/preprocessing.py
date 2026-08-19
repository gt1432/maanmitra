import re
import string
import pandas as pd
import numpy as np

def clean_text(text):
    """
    Clean raw input text:
    1. Lowercase conversion
    2. Removal of URLs, emails, special symbols, extra whitespace
    3. Tokenization & punctuation removal
    """
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    # Remove numbers and punctuation
    text = re.sub(r'[%s]' % re.escape(string.punctuation), ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def preprocess_student_mental_health(df):
    """
    Clean and engineer features for the Student Mental Health tabular dataset.
    Target: 'Distress_Level' (0: Low, 1: Moderate, 2: High)
    """
    df = df.copy()
    
    # Standardize column names
    col_map = {
        'Choose your gender': 'gender',
        'Age': 'age',
        'What is your course?': 'course',
        'Your current year of Study': 'year_of_study',
        'What is your CGPA?': 'cgpa',
        'Marital status': 'marital_status',
        'Do you have Depression?': 'depression',
        'Do you have Anxiety?': 'anxiety',
        'Do you have Panic attack?': 'panic_attack',
        'Did you seek any specialist for a treatment?': 'treatment'
    }
    df = df.rename(columns=col_map)
    
    # Fill missing values
    df['age'] = pd.to_numeric(df['age'], errors='coerce')
    df['age'] = df['age'].fillna(df['age'].median())
    
    df['gender'] = df['gender'].fillna('Female').str.strip()
    df['marital_status'] = df['marital_status'].fillna('No').str.strip()
    df['depression'] = df['depression'].fillna('No').str.strip()
    df['anxiety'] = df['anxiety'].fillna('No').str.strip()
    df['panic_attack'] = df['panic_attack'].fillna('No').str.strip()
    df['treatment'] = df['treatment'].fillna('No').str.strip()
    
    # Calculate composite Distress Score & Level
    # Depression (+2), Anxiety (+2), Panic Attack (+2), Treatment (+1)
    dep_val = (df['depression'].str.lower() == 'yes').astype(int)
    anx_val = (df['anxiety'].str.lower() == 'yes').astype(int)
    panic_val = (df['panic_attack'].str.lower() == 'yes').astype(int)
    treat_val = (df['treatment'].str.lower() == 'yes').astype(int)
    
    raw_score = dep_val * 2 + anx_val * 2 + panic_val * 2 + treat_val
    
    def get_distress_level(score):
        if score <= 1:
            return 'LOW'
        elif score <= 3:
            return 'MODERATE'
        else:
            return 'HIGH'
            
    df['distress_level'] = raw_score.apply(get_distress_level)
    
    # One-hot / categorical encoding
    df['gender_code'] = (df['gender'].str.lower() == 'male').astype(int)
    df['marital_code'] = (df['marital_status'].str.lower() == 'yes').astype(int)
    
    # Clean CGPA
    def parse_cgpa(val):
        if not isinstance(val, str):
            return 3.0
        val = val.strip()
        if '3.50' in val or '3.5' in val or '3.50 - 4.00' in val:
            return 3.75
        elif '3.00' in val or '3.0' in val:
            return 3.25
        elif '2.50' in val or '2.5' in val:
            return 2.75
        elif '2.00' in val or '2.0' in val:
            return 2.25
        else:
            return 3.0
            
    df['cgpa_num'] = df['cgpa'].apply(parse_cgpa)
    
    # Year of study numeric conversion
    def parse_year(val):
        if not isinstance(val, str):
            return 1
        val = val.lower()
        if 'year 1' in val or 'yr 1' in val or '1' in val:
            return 1
        elif 'year 2' in val or 'yr 2' in val or '2' in val:
            return 2
        elif 'year 3' in val or 'yr 3' in val or '3' in val:
            return 3
        elif 'year 4' in val or 'yr 4' in val or '4' in val:
            return 4
        return 1
        
    df['year_num'] = df['year_of_study'].apply(parse_year)
    
    feature_cols = ['age', 'gender_code', 'marital_code', 'cgpa_num', 'year_num', 'depression_val', 'anxiety_val', 'panic_val']
    df['depression_val'] = dep_val
    df['anxiety_val'] = anx_val
    df['panic_val'] = panic_val
    
    return df, feature_cols, 'distress_level'
