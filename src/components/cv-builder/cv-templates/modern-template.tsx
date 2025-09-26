import formatPhoneDisplay from "@/helpers/formatPhoneNumber";
import type { CVData } from "@/types/cv";
import { format } from "date-fns";
import { Mail, MapPin } from "lucide-react";
import { FaGlobe, FaMobileAlt } from "react-icons/fa";

interface ModernTemplateProps {
  data: CVData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg font-sans">
      <header className="relative overflow-hidden max-w-4xl mx-auto">
        <div className="h-24 bg-background p-6 pl-44 flex items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{personalInfo.fullName}</h1>
            <p className="text-teal-500 font-medium text-xl">{personalInfo.desiredPosition}</p>
          </div>
        </div>

        <div className="bg-[#333B4E] text-gray-200 pt-6 pb-12 pl-44 pr-6 mx-2 rounded-t-sm">
          <p className="text-base leading-relaxed tracking-wide">{personalInfo.summary}</p>
        </div>

        <img
          src={personalInfo?.profileImage || "/images/career_point_logo.jpg"}
          alt={personalInfo?.fullName}
          className="absolute left-7 top-[32px] w-32 h-32 rounded-full border-4 shadow-lg object-cover"
        />
      </header>

      <section className="space-y-6 px-6 py-1 rounded-b-sm bg-[#43949B] mx-2 mb-2">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm text-gray-50">
              {personalInfo?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {personalInfo.email}
                </span>
              )}
              {personalInfo?.phone && (
                <span className="flex items-center gap-1">
                  <FaMobileAlt className="w-4 h-4" /> {formatPhoneDisplay(personalInfo.phone)}
                </span>
              )}
              {personalInfo?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {personalInfo.location}
                </span>
              )}
              {personalInfo?.website && (
                <a href={personalInfo.website} className="hover:underline flex items-center gap-1">
                  <FaGlobe className="w-4 h-4" /> {personalInfo.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Work Experience */}
          {experiences?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 uppercase">
                Work Experience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-primary font-semibold">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.location}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-[#43949B] italic">
                      {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                    </span>
                    {exp.description && <p className="text-gray-700 my-3">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 uppercase">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-primary font-semibold">{edu.institution}</p>
                          <p className="text-gray-600 text-sm">{edu.location}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-[#43949B] italic">
                      {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                    </span>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 uppercase">
                Projects
              </h2>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                      <span className="text-[#43949B] text-sm">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-[#43949B] text-secondary px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      {project.url && (
                        <a href={project.url} className="text-primary hover:underline text-sm font-normal">
                          Live Demo: {project.url}
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} className="text-primary hover:underline text-sm font-normal">
                          GitHub: {project.github}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-6 bg-slate-100 rounded-md px-7 py-2">
          {/* Skills */}
          {skills?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 uppercase">Skills</h2>
              <div className="space-y-4">
                {["Technical", "Soft", "Language", "Other"].map((category) => {
                  const categorySkills = skills.filter((skill) => skill.category === category);
                  if (categorySkills.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categorySkills.map((skill) => (
                          <div key={skill.id}>
                            <div className="flex flex-col justify-between text-sm mb-1">
                              <span className="text-gray-700">{skill.name}</span>
                              <span className="text-[#43949B]">{skill.level}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 uppercase">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-gray-700 font-medium">{lang.name}</span>
                    <span className="text-[#43949B] text-sm">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 uppercase">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">{cert.name}</h3>
                      <p className="text-[#43949B] text-xs">{formatDate(cert.issueDate)}</p>
                    </div>
                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
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
