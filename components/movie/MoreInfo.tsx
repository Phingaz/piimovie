import { MovieDetail } from "@/app/types";
import {
  Flag,
  Globe,
  MessageSquareQuote,
  CircleCheck,
  MessageCircle,
  DollarSign,
  Building,
  MapPin,
  TrendingUp,
} from "lucide-react";
import SectionTitle from "../utils/texts/SectionTitle";
import { formatCurrency } from "@/lib/utils";

const MoreInfo = ({ movie }: { movie: MovieDetail }) => {
  const revenue = movie.revenue - movie.budget;
  const revenuePercentage = (revenue / movie.budget) * 100;

  return (
    <div className="p-4 bg-background rounded-md border border-gray-500/50">
      <SectionTitle>
        <>Movie Information</>
      </SectionTitle>

      <div className="grid md:grid-cols-3 md:gap-5 gap-0">
        <div className="flex flex-col col-span-1">
          {/* Origin Country */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <Flag size={16} />
            <span className="font-medium">Origin:</span>
            <span>{movie.origin_country.join(", ")}</span>
          </div>

          {/* Original Language */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <Globe size={16} />
            <span className="font-medium">Language:</span>
            <span>
              {movie.original_language === "en"
                ? "English"
                : movie.original_language}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <CircleCheck size={16} />
            <span className="font-medium">Status:</span>
            <span>{movie.status}</span>
          </div>

          {/* Budget */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <DollarSign size={16} />
            <span className="font-medium">Budget:</span>
            <span>{formatCurrency(movie.budget)}</span>
          </div>

          {/* Revenue */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <TrendingUp size={16} />
            <span className="font-medium">Revenue:</span>
            <span className="mr-1">{formatCurrency(movie.revenue)}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-md ${
                revenuePercentage > 1
                  ? "bg-green-500/20 text-green-700"
                  : "bg-red-500/20 text-red-700"
              }`}
            >
              {(revenuePercentage > 1 ? revenuePercentage : 0).toFixed()}%
            </span>
          </div>
        </div>

        <div className="flex flex-col col-span-2">
          {/* Tagline */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <MessageSquareQuote size={16} />
            <span className="font-medium">Tagline:</span>
            <span className="text-sm italic">{movie.tagline}</span>
          </div>

          {/* Spoken Languages */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <MessageCircle size={16} />
            <span className="font-medium">Spoken Languages:</span>
            <span>{movie.spoken_languages.map((l) => l.name).join(", ")}</span>
          </div>

          {/* Production Countries */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <MapPin size={16} />
            <span className="font-medium">Countries:</span>
            <span>
              {movie.production_countries.map((c) => c.name).join(", ")}
            </span>
          </div>

          {/* Production Companies */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <Building size={16} />
            <span className="font-medium">Companies:</span>
            <span>
              {movie.production_companies
                .map((c: { name: string }) => c.name)
                .join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;
