import ContactList from "@/components/contact-list";
import MotionText from "@/components/motion-text";
import MotionDiv from "@/components/motion-div";
import { getAssetPath } from "@/utils/paths";

export default function hero() {
  return (
    <section className="my-8 flex flex-col items-center justify-center px-4 sm:px-6 md:my-12">
      <h1 className="mb-4 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        <MotionText delayOffset={0}>Hi, I'm Abishek Maharajan! 👋</MotionText>
      </h1>
      <div className="overflow-hidden rounded-full p-3 md:p-4">
        <MotionDiv>
          <video
            className="h-[170px] w-[140px] object-contain md:h-[190px] md:w-[160px]"
            width="160"
            height="190"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster={getAssetPath("memoji_poster.jpg")}
          >
            <source
              src={getAssetPath("memoji_out_optimized.mp4")}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </MotionDiv>
      </div>
      <div className="my-4 flex flex-col items-center gap-2">
        <MotionDiv delayOffset={0.8}>
          <h1 className="text-2xl font-bold">Developer 🧑🏻‍💻</h1>
        </MotionDiv>
        <MotionDiv delayOffset={0.9}>
          <h1 className="text-2xl font-bold">Photographer 📸</h1>
        </MotionDiv>
        <MotionDiv delayOffset={1}>
          <h1 className="text-2xl font-bold">LLM Enthusiast 🤖</h1>
        </MotionDiv>
      </div>
      <div className="my-12 flex w-full max-w-3xl flex-col gap-4 px-4 text-center sm:px-6">
        <MotionDiv delayOffset={1.2}>
          <p className="text-lg font-semibold leading-relaxed text-gray-700 sm:text-xl md:text-2xl">
            "The true sign of intelligence is not knowledge but imagination."
          </p>
        </MotionDiv>
        <MotionDiv delayOffset={1.4}>
          <p className="text-sm text-gray-600 sm:text-base">
            — Albert Einstein
          </p>
        </MotionDiv>
        <MotionDiv delayOffset={1.6}>
          <p className="mt-4 text-base leading-relaxed sm:text-lg md:text-xl">
            I'm a polymath developer with a passion for building intelligent
            systems and capturing moments through photography. I thrive at the
            intersection of technology, creativity, and artificial intelligence.
          </p>
        </MotionDiv>
      </div>
      <div className="my-8">
        <ContactList delayOffset={1.45} showWhenInView={false} />
      </div>
    </section>
  );
}
