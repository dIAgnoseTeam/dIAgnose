import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../styles/tour.css";

const TOUR_KEY = "dlagnose_tour_completed";

const STEPS = [
  {
    element: "#home",
    popover: {
      title: "Inicio",
      description:
        "Aquí encontrarás los casos clínicos asignados para valorar. Cada caso requiere tu criterio médico profesional.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#chat",
    popover: {
      title: "Asistente IA",
      description:
        "Consulta al asistente de inteligencia artificial para apoyar tu diagnóstico diferencial cuando lo necesites.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#case-card",
    popover: {
      title: "Caso clínico",
      description:
        "Lee detenidamente toda la información antes de emitir tu valoración. Los casos están organizados por secciones.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#case-form",
    popover: {
      title: "Formulario de valoración",
      description:
        "Puntúa cada dimensión del caso del 1 al 5. Puedes añadir un comentario libre si lo consideras necesario.",
      side: "left",
      align: "start",
    },
  },
  {
    popover: {
      title: "¡Listo para empezar!",
      description: "¡Comienza tu experiencia en Dlagnose!",
    },
  },
];

export const useTour = () => {
  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) return;

    const driverObj = driver({
      popoverClass: "dlagnose-tour",
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      doneBtnText: "Entendido",
      stagePadding: 6,
      stageRadius: 10,
      overlayOpacity: 0.3,
      onDestroyStarted: () => {
        localStorage.setItem(TOUR_KEY, "true");
        driverObj.destroy();
      },
      steps: STEPS,
    });

    setTimeout(() => driverObj.drive(), 600);
    const timeoutId = setTimeout(() => driverObj.drive(), 600);
    return () => {
      clearTimeout(timeoutId);
      driverObj.destroy();
    };
  }, []);
};
