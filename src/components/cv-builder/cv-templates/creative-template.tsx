import formatPhoneDisplay from "@/helpers/formatPhoneNumber";
import type { CVData } from "@/types/cv";
import { format } from "date-fns";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaGlobe, FaMobileAlt } from "react-icons/fa";

interface CreativeTemplateProps {
  data: CVData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#3853A6] via-[#3677B4] to-[#44c2ec] shadow-2xl font-sans overflow-hidden flex">
      {/* Left Sidebar - Blue Gradient */}
      <div className="w-1/3 bg-transparent text-white py-16 px-6 space-y-8">
        {/* Profile Photo */}
        <div className="flex justify-center mb-8">
          <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden">
            <img
              src={personalInfo?.profileImage || "/images/career_point_logo.jpg"}
              alt={personalInfo?.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact Section */}
        {personalInfo?.email ||
          personalInfo?.phone ||
          personalInfo?.website ||
          personalInfo?.location ||
          personalInfo?.github ||
          (personalInfo?.linkedin && (
            <section>
              <h2 className="text-xl font-bold mb-4 tracking-wide">CONTACT</h2>
              <div className="space-y-3 text-sm">
                {personalInfo?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="border border-white rounded-full p-1 flex items-center justify-center">
                      <Phone className="text-white w-3 h-3" />
                    </div>
                    <span>{formatPhoneDisplay(personalInfo.phone)}</span>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="flex items-center gap-3">
                    <div className="border border-white rounded-full p-1 flex items-center justify-center">
                      <Mail className="text-white w-3 h-3" />
                    </div>
                    <span className="break-all">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo?.website && (
                  <div className="flex items-center gap-3">
                    <div className="border border-white rounded-full p-1 flex items-center justify-center">
                      <FaGlobe className="text-white w-3 h-3" />
                    </div>
                    <a href={personalInfo.website} className="break-all hover:underline">
                      {personalInfo.website}
                    </a>
                  </div>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center gap-3">
                    <div className="border border-white rounded-full p-1 flex items-center justify-center">
                      <MapPin className="text-white w-3 h-3" />
                    </div>
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </section>
          ))}

        {/* Skills */}
        {skills?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-wide">SKILLS</h2>
            <div className="space-y-4">
              {skills.slice(0, 6).map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/20 rounded-full h-2"></div>
                    <div
                      className="absolute top-0 left-0 bg-white h-2 rounded-full transition-all duration-300"
                      style={{
                        width:
                          skill.level === "Expert"
                            ? "100%"
                            : skill.level === "Advanced"
                            ? "80%"
                            : skill.level === "Intermediate"
                            ? "60%"
                            : "40%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {languages?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-wide">LANGUAGES</h2>
            <div>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between mb-2">
                  <span className="text-slate-50 text-sm">{lang.name}</span>
                  <span className="text-slate-50 text-sm">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATION */}
        {certifications?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 tracking-wide">CERTIFICATION</h2>
            <div className="space-y-4">
              {certifications.map((certification, index) => (
                <div key={certification.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{certification.name}</span>
                    {formatDate(certification.issueDate)}
                  </div>
                  <span className="text-xs text-slate-200">{certification.issuer}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Main Content */}
      <div className="w-2/3 py-16  bg-white rounded-tl-[150px] rounded-bl-[150px]">
        {/* Header */}
        <header className="mb-8 flex justify-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {personalInfo?.fullName?.toUpperCase()}
            </h1>
            <h2 className="text-xl font-semibold text-[#3395C2] mb-4 uppercase">{personalInfo.desiredPosition}</h2>
          </div>
        </header>

        <div className="pl-10 pr-6">
          {/* About Section */}
          {personalInfo?.summary && (
            <section className="mb-8">
              <h3 className="text-lg font-bold text-[#3395C2] mb-3  pb-1">ABOUT</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{personalInfo?.summary}</p>
            </section>
          )}

          {/* Experience Section */}
          {experiences?.length > 0 && (
            <section className="mb-8">
              <div className="flex flex-row items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-[#3395C2]">EXPERIENCE</h3>
                <div className="border-b-2 border-dotted border-gray-600 flex-1" />
              </div>

              <div className="space-y-4">
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="flex">
                    <div className="w-32 flex-shrink-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{exp.jobTitle}</h4>
                      <div className="text-xs font-semibold text-slate-500">
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                      </div>
                    </div>
                    <div className="flex-1 ml-2 border-l-2 border-gray-300 pl-4">
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-slate-900 font-medium text-sm">{exp.company}</p>
                        <p className="text-gray-600 text-sm">{exp.location}</p>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education?.length > 0 && (
            <section className="mb-8">
              <div className="flex flex-row items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-[#3395C2]">EDUCATION</h3>
                <div className="border-b-2 border-dotted border-gray-600 flex-1" />
              </div>
              <div className="space-y-4">
                {education.slice(0, 3).map((edu) => (
                  <div key={edu.id} className="flex">
                    <div className="w-32 flex-shrink-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{edu.institution}</h4>
                      <div className="text-xs font-semibold text-slate-500">
                        {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                      </div>
                    </div>
                    <div className="flex-1 ml-2 border-l-2 border-gray-300 pl-4">
                      <p className="text-slate-900 font-medium text-sm">{edu.degree}</p>
                      {edu.gpa && <p className="text-slate-900 font-medium text-sm">GPA: {edu.gpa}</p>}
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects?.length > 0 && (
            <section>
              <div className="flex flex-row items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-[#3395C2]">PROJECT</h3>
                <div className="border-b-2 border-dotted border-gray-600 flex-1" />
              </div>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex">
                    <div className="w-32 flex-shrink-0">
                      <div className="text-xs font-semibold text-slate-500">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </div>
                    </div>
                    <div className="flex-1 ml-2 border-l-2 border-gray-300 pl-4">
                      <h4 className="font-semibold text-gray-900 text-sm">{project.name}</h4>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.url && (
                        <div className="flex flex-row items-center gap-2 text-xs text-slate-500 mt-2">
                          Live Demo:
                          <a href={project.url} className="hover:underline">
                            {project.url}
                          </a>
                        </div>
                      )}
                      {project.github && (
                        <div className="flex flex-row items-center gap-2 text-xs text-slate-500 mt-2">
                          Github URL:
                          <a href={project.github} className="hover:underline">
                            {project.github}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
