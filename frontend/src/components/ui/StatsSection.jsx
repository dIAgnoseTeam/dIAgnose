import StatCard from "./StatCard";

const StatsSection = (props) => {
  const { reviews } = props;
  const totalReviews = reviews.length;

  const avgRating = totalReviews
    ? reviews.reduce((acc, r) => acc + r.puntuacion, 0) / totalReviews
    : 0;

  const minRating = totalReviews
    ? Math.min(...reviews.map((r) => r.puntuacion))
    : 0;

  const maxDate = totalReviews
    ? new Date(Math.max(...reviews.map((r) => new Date(r.fecha).getTime())))
    : null;

  return (
    <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
      <StatCard
        title={"Total valoraciones"}
        value={totalReviews}
        icon={"Star"}
        iconStyle="bg-yellow-100 p-2 rounded-lg text-yellow-600"
      ></StatCard>
      <StatCard
        title={"Media puntuación"}
        value={avgRating.toFixed(1)}
        icon={"BarChart"}
        iconStyle="bg-green-100 p-2 rounded-lg text-green-600"
      ></StatCard>
      <StatCard
        title={"Putuación más baja"}
        value={minRating}
        icon={"ArrowDown"}
        iconStyle="bg-red-100 p-2 rounded-lg text-red-600"
      ></StatCard>
      <StatCard
        title={"Valoración más reciente"}
        value={maxDate ? maxDate.toLocaleDateString() : "-"}
        icon={"Clock"}
        iconStyle="bg-blue-100 p-2 rounded-lg text-blue-600"
      ></StatCard>
    </section>
  );
};

export default StatsSection;
