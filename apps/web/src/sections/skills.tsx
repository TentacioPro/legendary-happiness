import MotionDiv from "@/components/motion-div";
import MotionList from "@/components/motion-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faReact,
  faNodeJs,
  faCss3,
  faHtml5,
  faJs,
  faGit,
  faGithub,
  faAws,
  faLinux,
  faDocker,
  faPython,
} from "@fortawesome/free-brands-svg-icons";
import {
  faDatabase,
  faChartLine,
  faSquare,
  faCode,
  faCircle,
  faCubes,
  faCloud,
  faServer,
  faBrain,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

interface Skill {
  name: string;
  icon: IconDefinition;
}

interface SkillSection {
  title: string;
  skills: Skill[];
}

export default function Skills() {
  const data: SkillSection[] = [
    {
      title: "Programming",
      skills: [
        {
          name: "JavaScript",
          icon: faJs,
        },
        {
          name: "Python",
          icon: faPython,
        },
        {
          name: "C",
          icon: faCode,
        },
        {
          name: "CSS",
          icon: faCss3,
        },
        {
          name: "HTML",
          icon: faHtml5,
        },
        {
          name: "SQL",
          icon: faDatabase,
        },
      ],
    },
    {
      title: "Web Development",
      skills: [
        {
          name: "React.js",
          icon: faReact,
        },
        {
          name: "Node.js",
          icon: faNodeJs,
        },
        {
          name: "Express.js",
          icon: faCode,
        },
        {
          name: "MongoDB",
          icon: faDatabase,
        },
        {
          name: "Sequelize",
          icon: faDatabase,
        },
        {
          name: "REST APIs",
          icon: faChartLine,
        },
        {
          name: "TailwindCSS",
          icon: faCss3,
        },
        {
          name: "Material-UI",
          icon: faCss3,
        },
      ],
    },
    {
      title: "Data & Analytics",
      skills: [
        {
          name: "Apache Superset",
          icon: faChartLine,
        },
        {
          name: "Metabase",
          icon: faChartLine,
        },
        {
          name: "SQL Query Builder",
          icon: faDatabase,
        },
      ],
    },
    {
      title: "AI/ML & LLMs",
      skills: [
        {
          name: "LLama3",
          icon: faBrain,
        },
        {
          name: "Machine Learning",
          icon: faBrain,
        },
        {
          name: "AI Fundamentals",
          icon: faRobot,
        },
      ],
    },
    {
      title: "DevOps & Infrastructure",
      skills: [
        {
          name: "Git",
          icon: faGit,
        },
        {
          name: "Github",
          icon: faGithub,
        },
        {
          name: "AWS Cloud Practitioner",
          icon: faAws,
        },
        {
          name: "Linux/Bash",
          icon: faLinux,
        },
        {
          name: "Docker",
          icon: faDocker,
        },
        {
          name: "Kubernetes",
          icon: faCubes,
        },
        {
          name: "Cloud Infrastructure",
          icon: faCloud,
        },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="flex w-full flex-col items-center text-center"
    >
      <MotionDiv>
        <h2 className="mb-4">My Skills</h2>
      </MotionDiv>
      <div className="flex flex-wrap justify-center">
        {data.map((item, index) => (
          <MotionDiv key={index}>
            <div className="mb-6 md:px-2">
              <h3>{item.title}</h3>
              <MotionList className="flex flex-wrap justify-evenly gap-0 md:gap-5 md:px-6 lg:justify-center">
                {item.skills.map((skill) => (
                  <SkillCard key={skill.name} {...skill} />
                ))}
              </MotionList>
            </div>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
}

function SkillCard({ icon, name }: Skill) {
  return (
    <div className="group rounded-xl border-none p-5 text-center shadow-none transition-all duration-200 ease-linear hover:scale-110 hover:drop-shadow-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center">
          <FontAwesomeIcon icon={icon} className="h-8 w-8" />
        </div>
        <p>{name}</p>
      </div>
    </div>
  );
}
