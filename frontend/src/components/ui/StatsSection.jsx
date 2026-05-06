import StatCard from "./StatCard";

const StatsSection = (props) => {
  const { stats } = props;

  return (
    <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
      <StatCard
        title={"Total valoraciones"}
        value={stats.total}
        icon={"Star"}
        iconStyle="bg-yellow-100 p-2 rounded-lg text-yellow-600"
      ></StatCard>
      <StatCard
        title={"Media puntuación"}
        value={stats.media}
        icon={"BarChart"}
        iconStyle="bg-green-100 p-2 rounded-lg text-green-600"
      ></StatCard>
      <StatCard
        title={"Putuación más baja"}
        value={stats.minima}
        icon={"ArrowDown"}
        iconStyle="bg-red-100 p-2 rounded-lg text-red-600"
      ></StatCard>
      <StatCard
        title={"Valoración más reciente"}
        value={
          stats.mas_reciente
            ? new Date(stats.mas_reciente).toLocaleDateString("es-ES")
            : "-"
        }
        icon={"Clock"}
        iconStyle="bg-blue-100 p-2 rounded-lg text-blue-600"
      ></StatCard>
    </section>
  );
};

export default StatsSection;
