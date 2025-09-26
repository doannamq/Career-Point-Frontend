import formatPhoneDisplay from "@/helpers/formatPhoneNumber";
import type { CVData } from "@/types/cv";
import { format } from "date-fns";

interface MinimalTemplateProps {
  data: CVData;
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
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
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg font-sans text-sm leading-relaxed">
      {/* Header */}
      <header className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-5xl font-semibold text-gray-900 mb-5 text-center tracking-wider uppercase">
          {personalInfo?.fullName}
        </h1>
        <h3 className="text-xl font-normal text-gray-600 mb-5 text-center tracking-wider uppercase">
          {personalInfo?.desiredPosition}
        </h3>
        <div className="flex flex-wrap gap-4 text-gray-600 text-base tracking-wide justify-center">
          {personalInfo?.phone && <span>{formatPhoneDisplay(personalInfo.phone)}</span>}
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.website && (
            <a href={personalInfo.website} className="hover:underline">
              {personalInfo.website}
            </a>
          )}
          {personalInfo?.linkedin && (
            <a href={personalInfo.linkedin} className="hover:underline">
              {personalInfo.linkedin}
            </a>
          )}
          {personalInfo?.github && (
            <a href={personalInfo.github} className="hover:underline">
              {personalInfo.github}
            </a>
          )}
        </div>
      </header>

      {personalInfo?.summary && (
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 tracking-wider uppercase">Profile</h2>
          <p className="mt-4 text-gray-700 text-base tracking-wide leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences?.length > 0 && (
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 tracking-wider uppercase mb-2">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 text-base tracking-wide uppercase mb-2">{exp.jobTitle}</h3>
                  <span className="text-gray-600 text-base">
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 text-base">
                  {exp.company} • {exp.location}
                </p>
                {exp.description && <p className="text-gray-600 mb-2 text-base tracking-wide">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-base tracking-wide ml-8">
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
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 tracking-wider uppercase mb-2">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 text-base tracking-wide uppercase mb-2">{edu.degree}</h3>
                  <span className="text-gray-700 text-base">
                    {formatDate(edu.startDate)} - {edu.isCurrentStudy ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2 text-base">
                  {edu.institution} • {edu.location}
                </p>
                {edu.gpa && <p className="text-gray-700 mb-4 text-base">GPA: {edu.gpa}</p>}
                {edu.description && <p className="text-gray-700 text-base">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 tracking-wider uppercase mb-2">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Technical", "Soft", "Language", "Other"].map((category) => {
              const categorySkills = skills.filter((skill) => skill.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="font-medium text-gray-900 text-base tracking-wide uppercase mb-2">{category}</h3>
                  <div className="space-y-1">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex justify-between">
                        <span className="text-gray-700 text-base tracking-wide">{skill.name}</span>
                        <span className="text-gray-500 text-sm">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 uppercase tracking-wider">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 text-base tracking-wide">{project.name}</h3>
                  <span className="text-gray-600 text-base">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2 text-base tracking-wide">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-gray-500 text-base tracking-wide">
                    Technologies: {project.technologies.join(", ")}
                  </p>
                )}
                <div className="flex gap-4 mt-1">
                  {project.url && (
                    <a href={project.url} className="text-primary text-sm hover:underline">
                      Live Demo: {project.url}
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} className="text-primary text-sm hover:underline">
                      GitHub: {project.github}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2">Certifications</h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <span className="text-gray-600 text-sm">{formatDate(cert.issueDate)}</span>
                </div>
                <p className="text-gray-700">{cert.issuer}</p>
                {cert.credentialId && <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2">Languages</h2>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-700">{lang.name}</span>
                <span className="text-gray-500 text-sm">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
