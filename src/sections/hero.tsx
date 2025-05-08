import ContactList from "@/components/contact-list";
import MotionText from "@/components/motion-text";
import MotionDiv from "@/components/motion-div";

export default function hero() {
  return (
    <section className="my-8 flex flex-col items-center justify-center">
      <h1 className="mb-4 text-[1.4rem] md:text-[2rem]">
        <MotionText delayOffset={0}>Hi, I'm Abishek Maharajan! 👋</MotionText>
      </h1>
      <div className="overflow-hidden rounded-full p-3 md:p-4">
        <MotionDiv>
          <video
            className="h-[170px] w-[170px] md:h-[190px] md:w-[190px]"
            muted
            autoPlay
            loop
            playsInline
          >
            <source src={"/memoji_out.mp4"} type="video/mp4" />
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
      <div className="my-12 flex w-full flex-col gap-4 text-center lg:w-[50%]">
        <MotionDiv delayOffset={1.2}>
          <p className="text-xl font-semibold text-gray-700">
            "The true sign of intelligence is not knowledge but imagination."
          </p>
        </MotionDiv>
        <MotionDiv delayOffset={1.4}>
          <p className="text-gray-600">
            — Albert Einstein
          </p>
        </MotionDiv>
        <MotionDiv delayOffset={1.6}>
          <p className="mt-4">
            I'm a polymath developer with a passion for building intelligent systems and capturing moments through photography. I thrive at the intersection of technology, creativity, and artificial intelligence.
          </p>
        </MotionDiv>
      </div>
      <div className="my-8">
        <ContactList delayOffset={1.45} showWhenInView={false} />
      </div>
    </section>
  );
}
