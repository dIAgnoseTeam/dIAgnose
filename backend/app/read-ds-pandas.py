import pandas as pd

# Login using e.g. `huggingface-cli login` to access this dataset
splits = {
    "BVCM017101.txt_1": "data/BVCM017101.txt_1-00000-of-00001.parquet",
    "BVCM017101.txt_2": "data/BVCM017101.txt_2-00000-of-00001.parquet",
    "BVCM017101.txt_3": "data/BVCM017101.txt_3-00000-of-00001.parquet",
    "BVCM017101.txt_4": "data/BVCM017101.txt_4-00000-of-00001.parquet",
    "BVCM017101.txt_5": "data/BVCM017101.txt_5-00000-of-00001.parquet",
    "BVCM017101.txt_6": "data/BVCM017101.txt_6-00000-of-00001.parquet",
    "BVCM017101.txt_7": "data/BVCM017101.txt_7-00000-of-00001.parquet",
    "BVCM017101.txt_8": "data/BVCM017101.txt_8-00000-of-00001.parquet",
    "BVCM017101.txt_9": "data/BVCM017101.txt_9-00000-of-00001.parquet",
    "BVCM017101.txt_10": "data/BVCM017101.txt_10-00000-of-00001.parquet",
    "BVCM017101.txt_11": "data/BVCM017101.txt_11-00000-of-00001.parquet",
    "BVCM017101.txt_12": "data/BVCM017101.txt_12-00000-of-00001.parquet",
    "BVCM017101.txt_13": "data/BVCM017101.txt_13-00000-of-00001.parquet",
    "BVCM017101.txt_14": "data/BVCM017101.txt_14-00000-of-00001.parquet",
    "BVCM017101.txt_15": "data/BVCM017101.txt_15-00000-of-00001.parquet",
    "BVCM017101.txt_16_last": "data/BVCM017101.txt_16_last-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_1": "data/CasosClinicosAP_JART2020.txt_1-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_2": "data/CasosClinicosAP_JART2020.txt_2-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_3": "data/CasosClinicosAP_JART2020.txt_3-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_4": "data/CasosClinicosAP_JART2020.txt_4-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_5": "data/CasosClinicosAP_JART2020.txt_5-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_6": "data/CasosClinicosAP_JART2020.txt_6-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_7": "data/CasosClinicosAP_JART2020.txt_7-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_8": "data/CasosClinicosAP_JART2020.txt_8-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_9": "data/CasosClinicosAP_JART2020.txt_9-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_10": "data/CasosClinicosAP_JART2020.txt_10-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_11": "data/CasosClinicosAP_JART2020.txt_11-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_12": "data/CasosClinicosAP_JART2020.txt_12-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_13": "data/CasosClinicosAP_JART2020.txt_13-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_14": "data/CasosClinicosAP_JART2020.txt_14-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_15": "data/CasosClinicosAP_JART2020.txt_15-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_16": "data/CasosClinicosAP_JART2020.txt_16-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_17": "data/CasosClinicosAP_JART2020.txt_17-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_18": "data/CasosClinicosAP_JART2020.txt_18-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_19": "data/CasosClinicosAP_JART2020.txt_19-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_20": "data/CasosClinicosAP_JART2020.txt_20-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_21": "data/CasosClinicosAP_JART2020.txt_21-00000-of-00001.parquet",
    "CasosClinicosAP_JART2020.txt_22_last": "data/CasosClinicosAP_JART2020.txt_22_last-00000-of-00001.parquet",
    "CasosClinicosAP_JART2017.txt_1": "data/CasosClinicosAP_JART2017.txt_1-00000-of-00001.parquet",
    "CasosClinicosAP_JART2017.txt_2": "data/CasosClinicosAP_JART2017.txt_2-00000-of-00001.parquet",
    "CasosClinicosAP_JART2017.txt_3": "data/CasosClinicosAP_JART2017.txt_3-00000-of-00001.parquet",
    "CasosClinicosAP_JART2017.txt_4": "data/CasosClinicosAP_JART2017.txt_4-00000-of-00001.parquet",
    "CasosClinicosAP_JART2017.txt_5": "data/CasosClinicosAP_JART2017.txt_5-00000-of-00001.parquet",
    "CasosClinicosAP_JART2017.txt_6": "data/CasosClinicosAP_JART2017.txt_6-00000-of-00001.parquet",
}
df = pd.read_parquet(
    "hf://datasets/ilopezmon/casos_clinicos_completos/" + splits["BVCM017101.txt_1"]
)

print(df.head())

# Cantidad de registros en el dataset
print("Número de filas en el dataset:", len(df))

df = pd.read_parquet(
    "hf://datasets/ilopezmon/casos_clinicos_completos/" + splits["BVCM017101.txt_6"]
)

print(df.head())
