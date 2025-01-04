import LandingLeft from "./LandingLeft";
import LandingRight from "./LandingRight";
// import WaveSvg from "./WaveSvg";

export default function Landing() {
  return (
    <div className="inset-0 -z-10 h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {/* Content can go here */}
        <section className="relative grid grid-cols-2 w-full h-full m-12 z-10">
          <LandingLeft />
          <LandingRight />
        </section>
        {/* <WaveSvg /> */}
      </div>
    </div>
  );
}
