"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCVStore } from "@/lib/store/cv-store";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
import { useState } from "react";

export function ProjectsForm() {
  const { cvData, addProject, updateProject, removeProject } = useCVStore();
  const { projects } = cvData;
  console.log("projects", projects);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newTech, setNewTech] = useState<Record<string, string>>({});

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const addTechnology = (projectId: string) => {
    const tech = newTech[projectId]?.trim();
    if (!tech) return;

    const project = projects.find((p) => p.id === projectId);
    if (project && !project.technologies.includes(tech)) {
      updateProject(projectId, {
        technologies: [...project.technologies, tech],
      });
      setNewTech({ ...newTech, [projectId]: "" });
    }
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        technologies: project.technologies.filter((t) => t !== tech),
      });
    }
  };

  const handleTechKeyPress = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology(projectId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">Projects</CardTitle>
          <Button onClick={addProject} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có projects nào được thêm.</p>
            <p className="text-sm">Click "Thêm Project" để giới thiệu công việc của bạn.</p>
          </div>
        ) : (
          projects?.map((project, index) => (
            <Card key={project.id} className="border-l-4 border-l-blue-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      Project #{index + 1}
                      {project.name && ` - ${project.name}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleExpanded(project.id)}>
                      {expandedItems.has(project.id) ? "Thu gọn" : "Mở rộng"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedItems.has(project.id) && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`projectName-${project.id}`} className="mb-2">
                      Tên Project <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id={`projectName-${project.id}`}
                      value={project.name}
                      onChange={(e) => updateProject(project.id, { name: e.target.value })}
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`projectDescription-${project.id}`} className="mb-2">
                      Mô tả <span className="text-red-600">*</span>
                    </Label>
                    <Textarea
                      id={`projectDescription-${project.id}`}
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      placeholder="Hãy mô tả chức năng của dự án và vai trò của bạn trong dự án..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`projectStartDate-${project.id}`} className="mb-2">
                        Ngày bắt đầu
                      </Label>
                      <Input
                        id={`projectStartDate-${project.id}`}
                        type="month"
                        value={project.startDate}
                        onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`projectEndDate-${project.id}`} className="mb-2">
                        Ngày kết thúc
                      </Label>
                      <Input
                        id={`projectEndDate-${project.id}`}
                        type="month"
                        value={project.endDate}
                        onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`projectUrl-${project.id}`} className="mb-2">
                        Link demo
                      </Label>
                      <Input
                        id={`projectUrl-${project.id}`}
                        value={project.url || ""}
                        onChange={(e) => updateProject(project.id, { url: e.target.value })}
                        placeholder="https://myproject.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`projectGithub-${project.id}`} className="mb-2">
                        GitHub URL
                      </Label>
                      <Input
                        id={`projectGithub-${project.id}`}
                        value={project.github || ""}
                        onChange={(e) => updateProject(project.id, { github: e.target.value })}
                        placeholder="https://github.com/user/project"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2">Công nghệ sử dụng</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={newTech[project.id] || ""}
                          onChange={(e) => setNewTech({ ...newTech, [project.id]: e.target.value })}
                          placeholder="Add a technology (e.g., React, Node.js)"
                          onKeyPress={(e) => handleTechKeyPress(e, project.id)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addTechnology(project.id)}
                          disabled={!newTech[project.id]?.trim()}>
                          Add
                        </Button>
                      </div>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="gap-1">
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTechnology(project.id, tech)}
                                className="ml-1 hover:text-destructive">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
