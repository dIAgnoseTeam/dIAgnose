import { createContext, useContext } from "react";

/**
 * Context para compartir datos del caso clínico actual
 * 
 * El compañero puede usar este Context desde su componente de formulario para:
 * - Acceder al número del caso actual: caseNumber
 * - Acceder a los datos del caso: currentCase
 * - Llamar a onReviewSubmitted() cuando haya completado el formulario
 * 
 * Ejemplo de uso en el componente del compañero:
 * 
 * const { caseNumber, currentCase, onReviewSubmitted } = useCaseContext();
 * 
 * // En el handleSubmit del formulario:
 * // await enviarFormularioAlBackend(caseNumber, datosFormulario);
 * // onReviewSubmitted(); // Esto carga el siguiente caso automáticamente
 */

const CaseContext = createContext();

export const CaseProvider = ({ children, value }) => (
  <CaseContext.Provider value={value}>
    {children}
  </CaseContext.Provider>
);

export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error("useCaseContext debe usarse dentro de CaseProvider");
  }
  return context;
};
