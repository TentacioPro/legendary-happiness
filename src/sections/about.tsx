import CoolPortraitCard from "@/components/cool-portrait-card";
import MotionDiv from "@/components/motion-div";

export default function about() {
  return (
    <section
      id="about"
      className="mx-auto my-16 flex flex-col items-center justify-center gap-4 px-2 md:my-20  md:max-w-full lg:flex-row lg:items-start lg:gap-16"
    >
      <div className="order-2 lg:order-1 lg:w-2/3">
        <MotionDiv delayOffset={0.2}>
          <h2 className="mb-3 w-full text-center md:mb-6">About Me</h2>
        </MotionDiv>
        <article className="flex flex-col gap-4">
          <MotionDiv delayOffset={0.4}>
            <p>
              Hello, I'm Abishek Maharajan, a passionate technology enthusiast and full-stack developer based in India. I'm on a journey to explore and master the art of building robust web applications.
            </p>
          </MotionDiv>
          <MotionDiv delayOffset={0.5}>
            <p>
              With a strong foundation in modern web technologies, I specialize in building scalable applications using React 18, Node.js, and various database systems including MongoDB, MSSQL, and PostgreSQL. My recent exploration into Llama 3 has further expanded my capabilities in AI-driven applications.
            </p>
          </MotionDiv>
          <MotionDiv delayOffset={0.6}>
            <p>
              When I'm not coding, you can find me diving deep into new technologies, experimenting with different frameworks, and exploring innovative ways to solve complex problems through code.
            </p>
          </MotionDiv>
        </article>
      </div>
      <div className="lg:order-2 lg:w-1/3">
        <MotionDiv delayOffset={0.4}>
          <CoolPortraitCard className="hidden lg:block">
            <img
              src="/cropped.jpg"
              alt="photo"
              className="w-[350px] min-w-[300px] rounded-xl transition-all"
            />
          </CoolPortraitCard>
        </MotionDiv>
        <MotionDiv delayOffset={0.4}>
          <img
            src="/cropped.jpg"
            alt="photo"
            className="w-[350px] min-w-[300px] rounded-xl transition-all hover:rotate-3 hover:scale-105 lg:hidden"
          />
        </MotionDiv>
      </div>
    </section>
  );
}
