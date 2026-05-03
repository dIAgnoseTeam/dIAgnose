import React from "react";
import StatCard from "./StatCard";
import TotalReviewsIcon from "../icons/TotalReviewsIcon";
import MinRatingIcon from "../icons/MinRatingIcon";
import AvgRatingIcon from "../icons/AvgRatingIcon";
import RecentReviewIcon from "../icons/RecentReviewIcon";

const StatsSection = (props) => {
    const { reviews } = props;
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((acc, r) => acc + r.puntuacion, 0) / reviews.length;
    const minRating = Math.min(...reviews.map(r => r.puntuacion));
    const maxDate =  new Date(
        Math.max(...reviews.map(r => new Date(r.fecha).getTime()))
    );

    return (
        <section className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title={"Total valoraciones"} value={totalReviews} icon={<TotalReviewsIcon/>}></StatCard>
            <StatCard title={"Media puntuación"} value={avgRating.toFixed(1)} icon={<AvgRatingIcon/>}></StatCard>
            <StatCard title={"Putuación más baja"} value={minRating} icon={<MinRatingIcon/>}></StatCard>
            <StatCard title={"Valoración más reciente"} value={maxDate.toLocaleDateString()} icon={<RecentReviewIcon/>}></StatCard>
        </section>
    )
}

export default StatsSection;
