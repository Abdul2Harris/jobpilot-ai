"use client";

import { useState, KeyboardEvent } from "react";
import { Input, Button, Select, Switch, Tag } from "antd";
import {
  Zap,
  Briefcase,
  FolderKanban,
  GraduationCap,
  SlidersHorizontal,
  Plus,
  ExternalLink,
  Building2,
  Loader2,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card"; // adjust to your actual path
import { useProfile } from "@/services/auth"; // adjust to your actual path


/* ─── Section header inside a card ─── */
function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 flex items-center justify-center rounded-sm bg-primary/8 text-primary shrink-0">
          {icon}
        </span>
        <h2 className="text-[15px] font-bold text-on-surface tracking-tight leading-none">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────── page ──────────────────────────── */

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  /* local editable state */
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [desiredRole, setDesiredRole] = useState<string | undefined>(undefined);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [remoteAvailable, setRemoteAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* seed once from backend */
  const [seeded, setSeeded] = useState(false);
  if (profile && !seeded) {
    // setSummary(profile.summary ?? "");
    setSkills(profile.skills ?? []);
    setSeeded(true);
  }

  /* skill helpers */
  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function onSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  /* save */
  async function handleSave() {
    setSaving(true);
    // TODO: wire your updateProfile mutation here
    // await updateProfile.mutateAsync({ summary, skills, desiredRole, preferredLocation, remoteAvailable })
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  /* initials */
  function initials(name?: string | null) {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  // console.log("profile Certs:", profile?.certifications.map((c:any) => c.name));

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        .ps { animation: fadeSlideUp 0.4s ease both; }
        .exp-item + .exp-item {
          border-top: 1px solid rgba(199,196,215,0.2);
          padding-top: 20px;
          margin-top: 4px;
        }
      `}</style>

      <div className="flex flex-col gap-5">
        {/* ── Page heading ── */}
        <div className="ps" style={{ animationDelay: "0ms" }}>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface leading-tight">
            Profile
          </h1>
          <p className="text-sm text-on-surface-faint mt-1">
            Manage your personal and professional information
          </p>
        </div>

        {/* ══════════ IDENTITY CARD ══════════ */}
        <Card
          className="ps"
          style={{ animationDelay: "60ms" } as React.CSSProperties}
        >
          <CardContent>
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl shrink-0 select-none">
                {initials(profile.name)}
              </div>

              <div className="flex-1 min-w-0">
                {/* name + badge */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface tracking-tight">
                      {profile.name}
                    </h2>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-primary hover:underline mt-0.5 block"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm bg-success/8 text-success border border-success/15 shrink-0">
                    Active Candidate
                  </span>
                </div>

                {/* summary preview */}
                {profile.summary && (
                  <p className="text-sm text-on-surface-variant mt-3 leading-relaxed line-clamp-3 !w-full">
                    {profile.summary}
                  </p>
                )}

                {/* social links */}
                {(profile.linkedin || profile.github || profile.portfolio) && (
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-faint hover:text-primary transition-colors"
                      >
                        <ExternalLink size={12} />
                        LinkedIn
                      </a>
                    )}
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-faint hover:text-primary transition-colors"
                      >
                        <ExternalLink size={12} />
                        GitHub
                      </a>
                    )}
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-faint hover:text-primary transition-colors"
                      >
                        <ExternalLink size={12} />
                        Portfolio
                      </a>
                    )}
                  </div>
                )}

                {/* experience summary pills */}
                {profile.experience_summary && (
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {profile.experience_summary.total_experience_years > 0 && (
                      <span className="text-xs px-2.5 py-1 rounded-sm bg-surface-low text-on-surface-faint border border-outline-variant/20">
                        {profile.experience_summary.total_experience_years}y
                        total
                      </span>
                    )}
                    {profile.experience_summary.fulltime_experience_years >
                      0 && (
                      <span className="text-xs px-2.5 py-1 rounded-sm bg-surface-low text-on-surface-faint border border-outline-variant/20">
                        {profile.experience_summary.fulltime_experience_years}y
                        full-time
                      </span>
                    )}
                    {profile.experience_summary.internship_experience_months >
                      0 && (
                      <span className="text-xs px-2.5 py-1 rounded-sm bg-surface-low text-on-surface-faint border border-outline-variant/20">
                        {
                          profile.experience_summary
                            .internship_experience_months
                        }
                        mo internships
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ══════════ PROFESSIONAL SUMMARY ══════════ */}
        {/* <Card className="ps" style={{ animationDelay: "100ms" } as React.CSSProperties}>
          <CardContent>
            <SectionHeader icon={<FileText size={15} />} title="Professional Summary" />
            <TextArea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a short professional summary that highlights your strengths, expertise, and career goals..."
              rows={5}
              style={{ resize: "vertical" }}
            />
          </CardContent>
        </Card> */}

        {/* ══════════ EXPERTISE & SKILLS ══════════ */}
        <Card
          className="ps"
          style={{ animationDelay: "140ms" } as React.CSSProperties}
        >
          <CardContent>
            <SectionHeader
              icon={<Zap size={15} />}
              title="Expertise & Skills"
            />

            {/* skill chips using AntD Tag */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <Tag
                    key={skill}
                    closable
                    onClose={() => removeSkill(skill)}
                    className="text-xs font-medium rounded-sm px-2.5 py-1 border-outline-variant/30 bg-surface-low text-on-surface-variant"
                    style={{ borderRadius: 6 }}
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            )}

            {/* skill input */}
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={onSkillKeyDown}
              placeholder="Type a skill and press Enter..."
              suffix={
                <Button
                  type="link"
                  size="small"
                  disabled={!skillInput.trim()}
                  onClick={addSkill}
                  className="text-xs font-semibold p-0"
                >
                  Add Skill
                </Button>
              }
            />
          </CardContent>
        </Card>

        {/* ══════════ EXPERIENCE ══════════ */}
        {profile.experience && profile.experience.length > 0 && (
          <Card
            className="ps"
            style={{ animationDelay: "180ms" } as React.CSSProperties}
          >
            <CardContent>
              <SectionHeader
                icon={<Briefcase size={15} />}
                title="Experience"
                action={
                  <Button
                    type="link"
                    size="small"
                    icon={<Plus size={13} />}
                    className="text-xs font-semibold text-primary p-0 flex items-center gap-1"
                  >
                    Add Experience
                  </Button>
                }
              />

              <div className="flex flex-col">
                {profile.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="exp-item flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    {/* company icon */}
                    <div className="w-10 h-10 rounded-md bg-surface-low border border-outline-variant/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={16} className="text-on-surface-faint" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* role + meta */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="text-sm font-semibold text-on-surface tracking-tight">
                            {exp.role}
                          </h3>
                          <span className="text-sm text-primary font-medium">
                            {exp.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {exp.type && (
                            <span className="text-[10px] font-bold uppercase tracking-[0.07em] px-2 py-0.5 rounded-sm bg-surface-low text-on-surface-faint border border-outline-variant/20">
                              {exp.type}
                            </span>
                          )}
                          <span className="text-xs text-on-surface-faint flex items-center gap-1">
                            <Calendar size={11} />
                            {exp.duration}
                          </span>
                        </div>
                      </div>

                      {/* achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mt-2.5 flex flex-col gap-1.5">
                          {exp.achievements.map((ach, j) => (
                            <li
                              key={j}
                              className="text-sm text-on-surface-variant leading-relaxed flex gap-2"
                            >
                              <span className="mt-2 w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* technologies */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] px-2 py-0.5 rounded-sm bg-primary/5 text-primary/80 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ══════════ PROJECTS ══════════ */}
        {profile.projects && profile.projects.length > 0 && (
          <Card
            className="ps"
            style={{ animationDelay: "220ms" } as React.CSSProperties}
          >
            <CardContent>
              <SectionHeader
                icon={<FolderKanban size={15} />}
                title="Projects"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.projects.map((project, i) => (
                  <div
                    key={i}
                    className="group flex flex-col gap-2 p-5 rounded-md bg-surface-low border border-outline-variant/20 hover:border-primary/20 hover:shadow-md transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-on-surface tracking-tight">
                        {project.name}
                      </h3>
                      <ExternalLink
                        size={13}
                        className="text-on-surface-faint group-hover:text-primary transition-colors shrink-0 mt-0.5"
                      />
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {project.description}
                    </p>
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] px-2 py-0.5 rounded-sm bg-surface-highest text-on-surface-faint font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    <span className="text-[11px] font-bold text-primary uppercase tracking-[0.07em] flex items-center gap-1 mt-auto pt-2 group-hover:gap-2 transition-all">
                      View Project
                      <ExternalLink size={10} />
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ══════════ EDUCATION + PREFERENCES ══════════ */}
        <div
          className="ps grid grid-cols-1 sm:grid-cols-2 gap-4 items-start"
          style={{ animationDelay: "260ms" } as React.CSSProperties}
        >
          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <Card>
              <CardContent>
                <SectionHeader
                  icon={<GraduationCap size={15} />}
                  title="Education"
                />
                <div className="flex flex-col gap-5">
                  {profile.education.map((edu, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <h3 className="text-sm font-semibold text-on-surface tracking-tight">
                        {edu.degree}
                      </h3>
                      <span className="text-sm text-primary font-medium">
                        {edu.institution}
                      </span>
                      <span className="text-xs text-on-surface-faint mt-0.5">
                        Class of {edu.year}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          <Card>
            <CardContent>
              <SectionHeader
                icon={<SlidersHorizontal size={15} />}
                title="Preferences"
              />
              <div className="flex flex-col gap-4">
                {/* Desired role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-faint">
                    Desired Role
                  </label>
                  <Select
                    value={desiredRole}
                    onChange={(val) => setDesiredRole(val)}
                    placeholder="Select a role..."
                    className="w-full"
                    options={[
                      {
                        value: "Senior Product Designer",
                        label: "Senior Product Designer",
                      },
                      {
                        value: "Senior Frontend Engineer",
                        label: "Senior Frontend Engineer",
                      },
                      {
                        value: "Full Stack Engineer",
                        label: "Full Stack Engineer",
                      },
                      { value: "UX Researcher", label: "UX Researcher" },
                      { value: "Product Manager", label: "Product Manager" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>

                {/* Preferred location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-faint">
                    Preferred Location
                  </label>
                  <Input
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                {/* Remote toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium text-on-surface">
                    Remote Availability
                  </span>
                  <Switch
                    checked={remoteAvailable}
                    onChange={(checked) => setRemoteAvailable(checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ══════════ CERTIFICATIONS ══════════ */}
        {profile.certifications && profile.certifications.length > 0 && (
          <Card
            className="ps"
            style={{ animationDelay: "300ms" } as React.CSSProperties}
          >
            <CardContent>
              <SectionHeader icon={<Zap size={15} />} title="Certifications" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.certifications.map((cert: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 p-4 rounded-md bg-surface-low border border-outline-variant/20"
                  >
                    <span className="text-sm font-semibold text-on-surface tracking-tight">
                      {cert.name}
                    </span>
                    <span className="text-xs text-primary font-medium">
                      {cert.issuer}
                    </span>
                    {cert.year && (
                      <span className="text-xs text-on-surface-faint mt-0.5">
                        {cert.year}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ══════════ SAVE BUTTON ══════════ */}
        <div
          className="ps flex justify-end pb-8"
          style={{ animationDelay: "340ms" } as React.CSSProperties}
        >
          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={handleSave}
            className="px-8 font-semibold"
            icon={
              saved ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : undefined
            }
          >
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>
    </>
  );
}
