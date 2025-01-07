import { Button } from "@/components/ui/button";
import Hero from "./_components/Hero";
import MotionWrapperDelay from "@/components/FramerMotion/MotionWrapperDelay";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto py-10 sm:py-20 text-center px-4">
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <Hero />
        </MotionWrapperDelay>
      </section>
    </div>
  );
}
