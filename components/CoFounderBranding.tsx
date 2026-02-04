import Image from "next/image";
import Link from "next/link";
interface CoFounderBrandingProps {
  text?: string;
  className?: string;
}
const CoFounderBranding = ({
  text = "Powered by Co-Founder BD",
  className = "",
}: CoFounderBrandingProps) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 align-middle ${className}`}>
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center leading-relaxed">{text}</span>
      <div className="w-5 h-5 rounded-full bg-neutral-100 border border-gray-200 flex flex-shrink-0 items-center justify-center overflow-hidden">
        <Link href="https://cofounderbd.com" target="_blank" rel="noopener noreferrer">
        <Image
          src={"/CoFounder.ico"}
          alt="Co-Founder BD"
          width={20}
          height={20}
          className="w-full h-full object-cover"
        />
        </Link>
      </div>
    </div>
  );
};
export default CoFounderBranding;
