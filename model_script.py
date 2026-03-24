import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.miscmodels.ordinal_model import OrderedModel

# load data
df = pd.read_csv("/Users/abc/Desktop/papers/1. Papers/18.Multi-classifier-paper-cmc/current_study-without-lepto.csv")

df.head(5)


import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.miscmodels.ordinal_model import OrderedModel

# load data
df1 = pd.read_csv("/Users/abc/Desktop/papers/1. Papers/18.Multi-classifier-paper-cmc/code for EDA/Table_combined.csv")

df1.head(5)

x = df1["Variable"].unique()
x

features = ['fever_duration', 'abdominal_pain', 'abdpain_duration',
       'breathlessness', 'breathlessness_duration', 'cough',
       'cough_duration', 'joint_pain', 'seizures', 'myalgia', 'vomiting',
       'rash', 'gcs', 'hb', 'nu', 'ly', 'mo', 'platelets', 'sodium', 'tb',
       'db', 'protein', 'albumin', 'alkp', 'inotropes', 'ventilation',
       'icu', 'hosp_staty', 'jaundice', 'altered_sensorium', 'headache',
       'tc', 'creatinine', 'sgot', 'fever', 'dysuria', 'rash_type',
       'eschar', 'sgpt']

features = ['fever_duration',
       'breathlessness', 'cough','joint_pain', 'seizures', 'myalgia', 'vomiting',
       'rash', 'gcs', 'hb', 'nu', 'ly', 'mo', 'platelets', 'sodium', 'tb',
       'db', 'alkp', 'jaundice', 
       'tc', 'creatinine', 'sgot',
       'eschar', 'sgpt']

df[features]

X = df[features]
y = df["diagnosis"]

from sklearn.preprocessing import LabelEncoder

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

print("Class mapping")
for i, cls in enumerate(label_encoder.classes_):
    print(i, "->", cls)

from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

# train test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.20,
    random_state=42,
    stratify=y_encoded
)

print("Class distribution in training set")
print(Counter(y_train))

# XGBoost model without class weights
xgb_model = XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softprob",
    num_class=len(label_encoder.classes_),
    eval_metric="mlogloss",
    random_state=42
)

# fit model
xgb_model.fit(X_train, y_train)

# predictions
y_test_pred = xgb_model.predict(X_test)

print("Test Accuracy:", accuracy_score(y_test, y_test_pred))
print("\nClassification Report\n")
print(
    classification_report(
        y_test,
        y_test_pred,
        target_names=label_encoder.classes_
    )
)

# confusion matrix
cm = confusion_matrix(y_test, y_test_pred)

plt.figure(figsize=(7, 6))
plt.imshow(cm)
plt.colorbar()
plt.xticks(range(len(label_encoder.classes_)), label_encoder.classes_, rotation=45)
plt.yticks(range(len(label_encoder.classes_)), label_encoder.classes_)

for i in range(cm.shape[0]):
    for j in range(cm.shape[1]):
        plt.text(j, i, cm[i, j], ha="center", va="center")

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("XGBoost Confusion Matrix")
plt.tight_layout()
plt.show()


import pickle 

# save model to pkl file
with open("xgboost_multiclass_model2.pkl", "wb") as f:
    pickle.dump(xgb_model, f)

print("Model saved as xgboost_multiclass_model2.pkl")


with open("label_encoder2.pkl", "wb") as f:
    pickle.dump(label_encoder, f)

print("Label encoder saved as label_encoder2.pkl")


import shap
import numpy as np
import matplotlib.pyplot as plt

# create explainer
explainer = shap.TreeExplainer(xgb_model)

# compute SHAP values
# shape: (n_samples, n_features, n_classes)
shap_values = explainer.shap_values(X_test)

print("SHAP values shape:", shap_values.shape)

# -----------------------------------
# 1. Global SHAP summary plot
# -----------------------------------
# mean absolute SHAP over classes
shap_values_global = np.mean(np.abs(shap_values), axis=2)

shap.summary_plot(
    shap_values_global,
    X_test,
    feature_names=X.columns,
    show=True
)

# -----------------------------------
# 2. Class-wise SHAP summary plots
# -----------------------------------
for class_idx, class_name in enumerate(label_encoder.classes_):
    print("SHAP summary for class:", class_name)
    shap.summary_plot(
        shap_values[:, :, class_idx],
        X_test,
        feature_names=X.columns,
        show=True
    )

from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import numpy as np

dt_model = DecisionTreeClassifier(
    max_depth=12,
    min_samples_split=10,
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=42
)

dt_model.fit(X_train, y_train)

y_test_pred_dt = dt_model.predict(X_test)

print("Decision Tree Test Accuracy:", accuracy_score(y_test, y_test_pred_dt))
print("\nDecision Tree Classification Report\n")
print(classification_report(
    y_test,
    y_test_pred_dt,
    target_names=label_encoder.classes_
))

cm_dt = confusion_matrix(y_test, y_test_pred_dt)

plt.figure(figsize=(7, 6))
plt.imshow(cm_dt)
plt.colorbar()
plt.xticks(range(len(label_encoder.classes_)), label_encoder.classes_, rotation=45)
plt.yticks(range(len(label_encoder.classes_)), label_encoder.classes_)

for i in range(cm_dt.shape[0]):
    for j in range(cm_dt.shape[1]):
        plt.text(j, i, cm_dt[i, j], ha="center", va="center")

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Decision Tree Confusion Matrix")
plt.tight_layout()
plt.show()


from sklearn.ensemble import RandomForestClassifier

rf_model = RandomForestClassifier(
    n_estimators=500,
    max_depth=12,
    min_samples_split=10,
    min_samples_leaf=5,
    max_features="sqrt",
    class_weight="balanced_subsample",
    n_jobs=-1,
    random_state=42
)

rf_model.fit(X_train, y_train)

y_test_pred_rf = rf_model.predict(X_test)

print("Random Forest Test Accuracy:", accuracy_score(y_test, y_test_pred_rf))
print("\nRandom Forest Classification Report\n")
print(classification_report(
    y_test,
    y_test_pred_rf,
    target_names=label_encoder.classes_
))

cm_rf = confusion_matrix(y_test, y_test_pred_rf)

plt.figure(figsize=(7, 6))
plt.imshow(cm_rf)
plt.colorbar()
plt.xticks(range(len(label_encoder.classes_)), label_encoder.classes_, rotation=45)
plt.yticks(range(len(label_encoder.classes_)), label_encoder.classes_)

for i in range(cm_rf.shape[0]):
    for j in range(cm_rf.shape[1]):
        plt.text(j, i, cm_rf[i, j], ha="center", va="center")

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Random Forest Confusion Matrix")
plt.tight_layout()
plt.show()


from sklearn.ensemble import VotingClassifier

ensemble_model = VotingClassifier(
    estimators=[
        ("dt", dt_model),
        ("rf", rf_model),
        ("xgb", xgb_model)
    ],
    voting="soft",
    n_jobs=-1
)

ensemble_model.fit(X_train, y_train)

y_test_pred_ens = ensemble_model.predict(X_test)

print("Ensemble Test Accuracy:", accuracy_score(y_test, y_test_pred_ens))
print("\nEnsemble Classification Report\n")
print(classification_report(
    y_test,
    y_test_pred_ens,
    target_names=label_encoder.classes_
))

cm_ens = confusion_matrix(y_test, y_test_pred_ens)

plt.figure(figsize=(7, 6))
plt.imshow(cm_ens)
plt.colorbar()
plt.xticks(range(len(label_encoder.classes_)), label_encoder.classes_, rotation=45)
plt.yticks(range(len(label_encoder.classes_)), label_encoder.classes_)

for i in range(cm_ens.shape[0]):
    for j in range(cm_ens.shape[1]):
        plt.text(j, i, cm_ens[i, j], ha="center", va="center")

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Ensemble Confusion Matrix")
plt.tight_layout()
plt.show()

