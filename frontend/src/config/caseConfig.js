export const CASE_SECTIONS = [
  {
    id: "paciente",
    icon: "Stethoscope",
    title: "Datos del Paciente",
    fields: [
      { key: "edad", label: "Edad" },
      { key: "sexo", label: "Sexo" },
      { key: "alergias", label: "Alergias" },
      { key: "factores_sociales", label: "Factores sociales" },
    ],
  },
  {
    id: "antecedentes",
    icon: "Book",
    title: "Antecedentes",
    fields: [
      { key: "antecedentes_medicos", label: "Antecedentes médicos" },
      { key: "antecedentes_quirurgicos", label: "Antecedentes quirúrgicos" },
      { key: "antecedentes_familiares", label: "Antecedentes familiares" },
    ],
  },
  {
    id: "clinica",
    icon: "Dna",
    title: "Situación Clínica",
    fields: [
      { key: "habitos", label: "Hábitos" },
      { key: "situacion_basal", label: "Situación basal" },
      { key: "medicacion_actual", label: "Medicación actual" },
      { key: "motivo", label: "Motivo de consulta" },
      { key: "sintomas", label: "Síntomas" },
    ],
  },
  {
    id: "exploracion",
    icon: "Search",
    title: "Exploración y Pruebas",
    fields: [
      { key: "exploracion_general", label: "Exploración general" },
      { key: "signos", label: "Signos" },
      { key: "resultados_pruebas", label: "Resultados de pruebas" },
    ],
  },
  {
    id: "juicio",
    icon: "Brain",
    title: "Juicio Clínico",
    fields: [
      { key: "razonamiento_clinico", label: "Razonamiento clínico" },
      { key: "diagnostico_final", label: "Diagnóstico final" },
    ],
  },
  {
    id: "tratamiento",
    icon: "Pill",
    title: "Tratamiento",
    fields: [
      { key: "tratamiento_farmacologico", label: "Tratamiento farmacológico" },
      {
        key: "tratamiento_no_farmacologico",
        label: "Tratamiento no farmacológico",
      },
    ],
  },
  {
    id: "info",
    icon: "BookOpen",
    title: "Información Adicional",
    fields: [
      {
        key: "referencias_bibliograficas",
        label: "Referencias bibliográficas",
      },
      { key: "categoria", label: "Categoría" },
      { key: "keywords", label: "Keywords" },
      { key: "dificultad", label: "Dificultad" },
      { key: "agente", label: "Agente" },
      { key: "codigo_cie_10", label: "Código CIE-10" },
    ],
  },
];
