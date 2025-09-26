import formatPhoneDisplay from "@/helpers/formatPhoneNumber";
import type { CVData } from "@/types/cv";
import { format } from "date-fns";
import { AtSign, MapPin, Phone } from "lucide-react";

interface CorporateTemplateProps {
  data: CVData;
}

export function CorporateTemplate({ data }: CorporateTemplateProps) {
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Professional Header */}
      <header className="relative flex items-center pt-12 pl-12">
        <div className="relative z-10 w-48 h-48 rounded-full overflow-hidden border-10 border-white">
          <img
            src={personalInfo?.profileImage || "/images/career_point_logo.jpg"}
            alt={personalInfo?.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-[#D4DEE6] flex-1 ml-[-5rem] pl-32 py-10 pr-6">
          <h1 className="text-4xl font-semibold text-stone-800 mb-2">{personalInfo?.fullName?.toUpperCase()}</h1>
          <h2 className="text-xl text-stone-700 font-semibold">{personalInfo?.desiredPosition}</h2>
        </div>
      </header>

      <div className="flex m-8 ml-0">
        {/* left column */}
        <div className="w-1/3 bg-slate-200 p-8 rounded-t-4xl">
          {/* Contact information */}
          <div className="mb-8">
            <div className="space-y-3 text-sm text-gray-700">
              {personalInfo?.phone && (
                <div className="flex flex-row items-center gap-2">
                  <Phone className="w-4 h-4 rotate-y-180" />
                  <span>{formatPhoneDisplay(personalInfo.phone)}</span>
                </div>
              )}
              {personalInfo?.email && (
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex flex-row items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    <span>{personalInfo.email}</span>
                  </div>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex flex-row items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {education?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-2">
                EDUCATION
              </h2>
              <div>
                {education.map((edu, index) => (
                  <div key={edu.id} className="space-y-4">
                    <h3 className="font-normal text-gray-700 text-base">{edu.degree}</h3>
                    <p className="text-gray-900 font-medium text-sm">{edu.institution}</p>
                    <p className="text-gray-600 text-xs">
                      {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-2">
                SKILLS
              </h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <span className="text-gray-700">• {skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language */}
          {languages?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-2">
                LANGUAGES
              </h2>
              <div className="space-y-4">
                {languages.map((language) => (
                  <div key={language.id} className="text-sm">
                    <span className="text-gray-700">{language.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* certification */}
          {certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-2">
                CERTIFICATIONS
              </h2>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm">{cert.name}</span>
                    <span className="text-gray-500 text-xs">{formatDate(cert.issueDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right column */}
        <div className="w-2/3 p-6">
          {/* about me */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-3">
                About me
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">{personalInfo.summary}</p>
            </section>
          )}

          {/* work experience */}
          {experiences.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-3">
                Work Experience
              </h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <p className="text-sm font-semibold text-stone-800">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                  </p>
                  <p className="text-stone-800 font-normal text-sm">{exp.company}</p>
                  <h3 className="text-lg font-medium text-gray-800">{exp.jobTitle}</h3>
                  <p className="text-sm">{exp.description}</p>
                  <div className="flex flex-col items-start space-y-2 ml-4 mt-2">
                    {exp.achievements.map((achieve, index) => (
                      <div key={index} className="text-sm text-gray-700 list-disc list-inside">
                        • {achieve}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 uppercase tracking-wide border-b-[1.5px] border-gray-400 pb-3">
                Projects
              </h2>
              {projects.map((project) => (
                <div key={project.id} className="mb-6">
                  <div className="flex flex-row items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
                    <span className="text-xs text-slate-700">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-gray-600 text-sm tracking-wide">
                      Technologies: {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
