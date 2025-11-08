from datasets import load_dataset

# Login using e.g. `huggingface-cli login` to access this dataset
ds = load_dataset("ilopezmon/casos_clinicos_completos")

# Ver qué splits tiene el dataset
print("Splits disponibles:", ds.keys())
print("\n")

# Ver la estructura del primer split
for split_name in ds.keys():
    print(f"=== Split: {split_name} ===")
    print(f"Número de filas: {len(ds[split_name])}")
    print(f"Columnas: {ds[split_name].column_names}")
    print(f"Primer ejemplo:\n{ds[split_name][0]}")
    print("\n")
