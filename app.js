const defaultResume = {
  style: "classic",
  basics: {
    name: "张三",
    title: "前端开发工程师",
    birthday: "1999.08",
    school: "上海交通大学",
    phone: "138-0000-0000",
    email: "zhangsan@example.com",
    location: "上海",
    website: "github.com/zhangsan",
    political: "群众",
    summary:
      "3 年前端开发经验，熟悉业务中后台、数据可视化和组件化工程。关注交互细节、性能优化与可维护性，能够独立推进从需求梳理到上线交付的完整流程。",
    photo: ""
  },
  skills: ["JavaScript", "TypeScript", "Vue", "React", "Node.js", "数据可视化"],
  education: [
    {
      school: "上海交通大学",
      degree: "本科",
      major: "计算机科学与技术",
      location: "上海",
      start: "2018.09",
      end: "2022.06",
      details: ["GPA 3.7/4.0，主修数据结构、操作系统、数据库系统。"]
    }
  ],
  work: [
    {
      company: "某科技有限公司",
      role: "前端开发工程师",
      location: "上海",
      start: "2022.07",
      end: "至今",
      details: [
        "负责企业级管理后台核心模块，沉淀表格、表单、权限等通用组件。",
        "优化首屏资源加载和接口并发策略，关键页面加载时间降低约 35%。",
        "与产品、后端、测试协同完成多个业务迭代，保障版本按期交付。"
      ]
    }
  ],
  projects: [
    {
      name: "销售数据分析平台",
      role: "核心开发",
      tech: "Vue / ECharts / Node.js",
      start: "2023.03",
      end: "2023.10",
      details: [
        "实现多维筛选、图表联动、明细下钻和报表导出能力。",
        "封装可复用图表配置层，使新报表开发周期从 2 天缩短至半天。"
      ]
    }
  ],
  awards: [
    {
      name: "优秀毕业设计",
      issuer: "上海交通大学",
      date: "2022.06",
      description: "毕业设计获得学院优秀等级。"
    }
  ]
};

const sectionConfig = {
  education: {
    editor: "educationEditor",
    title: "教育经历",
    addText: "新增教育经历",
    template: {
      school: "",
      degree: "",
      major: "",
      location: "",
      start: "",
      end: "",
      details: []
    },
    fields: [
      ["school", "学校", "text"],
      ["degree", "学历", "text"],
      ["major", "专业", "text"],
      ["location", "城市", "text"],
      ["start", "开始时间", "text"],
      ["end", "结束时间", "text"],
      ["details", "补充说明（每行一条）", "textarea"]
    ]
  },
  work: {
    editor: "workEditor",
    title: "工作经历",
    addText: "新增工作经历",
    template: {
      company: "",
      role: "",
      location: "",
      start: "",
      end: "",
      details: []
    },
    fields: [
      ["company", "公司", "text"],
      ["role", "职位", "text"],
      ["location", "城市", "text"],
      ["start", "开始时间", "text"],
      ["end", "结束时间", "text"],
      ["details", "工作内容（每行一条）", "textarea"]
    ]
  },
  projects: {
    editor: "projectsEditor",
    title: "项目经历",
    addText: "新增项目经历",
    template: {
      name: "",
      role: "",
      tech: "",
      start: "",
      end: "",
      details: []
    },
    fields: [
      ["name", "项目名称", "text"],
      ["role", "角色", "text"],
      ["tech", "技术栈", "text"],
      ["start", "开始时间", "text"],
      ["end", "结束时间", "text"],
      ["details", "项目亮点（每行一条）", "textarea"]
    ]
  },
  awards: {
    editor: "awardsEditor",
    title: "成果 / 获奖",
    addText: "新增成果 / 获奖",
    template: {
      name: "",
      issuer: "",
      date: "",
      description: ""
    },
    fields: [
      ["name", "成果 / 奖项名称", "text"],
      ["issuer", "来源 / 颁发方", "text"],
      ["date", "时间", "text"],
      ["description", "说明", "textarea"]
    ]
  }
};

let resume = loadResume();

const form = document.querySelector("#resumeForm");
const preview = document.querySelector("#resumePreview");
const styleSelect = document.querySelector("#styleSelect");
const exportFormat = document.querySelector("#exportFormat");
const importFile = document.querySelector("#importFile");
let originalTitleForPrint = "";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadResume() {
  try {
    const saved = localStorage.getItem("resume-generator-state");
    return saved ? mergeResume(defaultResume, JSON.parse(saved)) : clone(defaultResume);
  } catch {
    return clone(defaultResume);
  }
}

function mergeResume(base, saved) {
  const merged = clone(base);
  Object.assign(merged, saved);
  merged.basics = { ...base.basics, ...(saved.basics || {}) };
  for (const key of ["skills", "education", "work", "projects", "awards"]) {
    merged[key] = Array.isArray(saved[key]) ? saved[key] : base[key];
  }
  return merged;
}

function persist() {
  localStorage.setItem("resume-generator-state", JSON.stringify(resume));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function splitList(value) {
  return String(value)
    .split(/\n|,|，/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value) {
  return String(value)
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function dateRange(start, end) {
  return [start, end].filter(Boolean).join(" - ");
}

function setByPath(path, value) {
  const parts = path.split(".");
  let target = resume;
  for (let i = 0; i < parts.length - 1; i += 1) {
    target = target[parts[i]];
  }
  target[parts.at(-1)] = value;
}

function getByPath(path) {
  return path.split(".").reduce((target, key) => target?.[key], resume);
}

function renderForm() {
  styleSelect.value = resume.style;

  document.querySelectorAll("[data-field]").forEach((element) => {
    const field = element.dataset.field;
    if (field === "skills") {
      element.value = resume.skills.join(", ");
      return;
    }
    element.value = getByPath(field) || "";
  });

  Object.keys(sectionConfig).forEach(renderRepeatSection);
}

function renderRepeatSection(sectionKey) {
  const config = sectionConfig[sectionKey];
  const container = document.querySelector(`#${config.editor}`);
  container.innerHTML = "";

  resume[sectionKey].forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "repeat-card";
    card.innerHTML = `
      <div class="repeat-header">
        <strong>${escapeHtml(config.title)} ${index + 1}</strong>
        <button class="danger-button" type="button" data-remove="${sectionKey}" data-index="${index}">删除</button>
      </div>
      <div class="field-grid two-columns">
        ${config.fields
          .map(([key, label, type]) => renderRepeatField(sectionKey, index, key, label, type, item[key]))
          .join("")}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderRepeatField(sectionKey, index, key, label, type, value) {
  const path = `${sectionKey}.${index}.${key}`;
  const displayValue = Array.isArray(value) ? value.join("\n") : value || "";
  if (type === "textarea") {
    return `
      <label>
        ${escapeHtml(label)}
        <textarea rows="3" data-path="${path}" data-list="${Array.isArray(value) ? "true" : "false"}">${escapeHtml(displayValue)}</textarea>
      </label>
    `;
  }
  return `
    <label>
      ${escapeHtml(label)}
      <input type="${type}" data-path="${path}" value="${escapeHtml(displayValue)}" />
    </label>
  `;
}

function renderPreview() {
  preview.className = `resume-page style-${resume.style}`;
  preview.innerHTML = `
    <div class="resume-layout">
      <aside class="resume-sidebar">
        <div class="sidebar-profile">
          ${resume.basics.photo ? `<img class="resume-photo" src="${resume.basics.photo}" alt="个人图片" />` : `<div class="photo-placeholder">照片</div>`}
          <h1 class="resume-name">${escapeHtml(resume.basics.name || "姓名")}</h1>
          <p class="resume-title">求职意向：${escapeHtml(resume.basics.title || "求职方向")}</p>
        </div>
        ${renderSidebarBlock("基本信息", [
          ["出生", resume.basics.birthday],
          ["学校", resume.basics.school],
          ["现居", resume.basics.location],
          ["政治面貌", resume.basics.political]
        ], "sidebar-basic")}
        ${renderSidebarBlock("联系方式", [
          ["手机", resume.basics.phone],
          ["邮箱", resume.basics.email],
          ["链接", resume.basics.website]
        ], "sidebar-contact")}
      </aside>
      <main class="resume-main">
        ${resume.basics.summary ? `
          <section class="resume-section section-summary">
            ${sectionHeading("个人简介", "summary")}
            <p class="resume-summary">${escapeHtml(resume.basics.summary)}</p>
          </section>
        ` : ""}
        ${renderSkills()}
        ${renderWork()}
        ${renderProjects()}
        ${renderEducation()}
        ${renderAwards()}
      </main>
    </div>
  `;
}

function renderSidebarBlock(title, items, className = "") {
  const content = items
    .filter(([, value]) => String(value || "").trim())
    .map(([label, value]) => `
      <div class="sidebar-row">
        <span class="sidebar-label">${escapeHtml(label)}</span>
        <span class="sidebar-value">${escapeHtml(value)}</span>
      </div>
    `)
    .join("");

  if (!content) return "";
  return `
    <section class="sidebar-section ${className}">
      <h2>${escapeHtml(title)}</h2>
      ${content}
    </section>
  `;
}

function renderSkills() {
  if (!resume.skills.length) return "";
  return `
    <section class="resume-section section-skills">
      ${sectionHeading("专业技能", "skills")}
      <ul class="skill-list">
        ${resume.skills
          .map((skill, index) => `<li class="${index < 3 ? "skill-primary" : ""}">${escapeHtml(skill)}</li>`)
          .join("")}
      </ul>
    </section>
  `;
}

function renderEducation() {
  return renderSection(
    "教育经历",
    resume.education.filter(hasContent).map((item) => `
      <div class="resume-item">
        <div class="item-topline">
          <div class="item-title">${escapeHtml(item.school)}</div>
          <div class="item-date">${escapeHtml(dateRange(item.start, item.end))}</div>
        </div>
        <div class="item-subtitle">${escapeHtml([item.degree, item.major].filter(Boolean).join(" / "))}</div>
        ${item.location ? `<div class="item-meta">${escapeHtml(item.location)}</div>` : ""}
        ${renderBullets(item.details)}
      </div>
    `),
    "section-education",
    "education"
  );
}

function renderWork() {
  return renderSection(
    "工作经历",
    resume.work.filter(hasContent).map((item) => `
      <div class="resume-item">
        <div class="item-topline">
          <div>
            <div class="item-title">${escapeHtml(item.company)}</div>
            <div class="item-subtitle">${escapeHtml(item.role)}</div>
          </div>
          <div class="item-date">${escapeHtml(dateRange(item.start, item.end))}</div>
        </div>
        ${item.location ? `<div class="item-meta">${escapeHtml(item.location)}</div>` : ""}
        ${renderBullets(item.details)}
      </div>
    `),
    "section-work",
    "work"
  );
}

function renderProjects() {
  return renderSection(
    "项目经历",
    resume.projects.filter(hasContent).map((item) => `
      <div class="resume-item">
        <div class="item-topline">
          <div>
            <div class="item-title">${escapeHtml(item.name)}</div>
            <div class="item-subtitle">${escapeHtml([item.role, item.tech].filter(Boolean).join(" / "))}</div>
          </div>
          <div class="item-date">${escapeHtml(dateRange(item.start, item.end))}</div>
        </div>
        ${renderBullets(item.details)}
      </div>
    `),
    "section-projects",
    "projects"
  );
}

function renderAwards() {
  return renderSection(
    "成果 / 获奖",
    resume.awards.filter(hasContent).map((item) => `
      <div class="achievement-item">
        <div class="achievement-date">${escapeHtml(item.date || "成果")}</div>
        <div class="achievement-content">
          <div class="achievement-title">${escapeHtml(item.name)}</div>
          ${item.issuer ? `<div class="achievement-issuer">${escapeHtml(item.issuer)}</div>` : ""}
          ${item.description ? `<div class="achievement-desc">${escapeHtml(item.description)}</div>` : ""}
        </div>
      </div>
    `),
    "section-achievements",
    "awards"
  );
}

function renderSection(title, items, className = "", icon = "") {
  const content = items.join("");
  if (!content.trim()) return "";
  return `
    <section class="resume-section ${className}">
      ${sectionHeading(title, icon)}
      ${content}
    </section>
  `;
}

function hasContent(item) {
  return Object.values(item).some((value) => {
    if (Array.isArray(value)) return value.some(Boolean);
    return Boolean(String(value || "").trim());
  });
}

function sectionHeading(title, icon = "") {
  return `
    <h2>
      <span class="section-icon" aria-hidden="true">${sectionIcon(icon)}</span>
      <span>${escapeHtml(title)}</span>
    </h2>
  `;
}

function sectionIcon(type) {
  const icons = {
    summary: '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
    skills: '<svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4-9 4z"/><path d="M7 10v4c0 2 10 2 10 0v-4"/></svg>',
    work: '<svg viewBox="0 0 24 24"><path d="M9 7V5h6v2"/><path d="M4 7h16v12H4z"/><path d="M4 12h16"/></svg>',
    projects: '<svg viewBox="0 0 24 24"><path d="M4 6h6l2 2h8v10H4z"/><path d="M7 12h10"/></svg>',
    education: '<svg viewBox="0 0 24 24"><path d="M3 8l9-4 9 4-9 4z"/><path d="M6 10v5c3 2 9 2 12 0v-5"/></svg>',
    awards: '<svg viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M9 15l-2 5 5-2 5 2-2-5"/></svg>'
  };
  return icons[type] || icons.summary;
}

function renderBullets(items) {
  if (!Array.isArray(items) || !items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

form.addEventListener("input", (event) => {
  const element = event.target;
  if (element.dataset.field === "skills") {
    resume.skills = splitList(element.value);
  } else if (element.dataset.field) {
    setByPath(element.dataset.field, element.value);
  } else if (element.dataset.path) {
    const value = element.dataset.list === "true" ? splitLines(element.value) : element.value;
    setByPath(element.dataset.path, value);
  }
  persist();
  renderPreview();
});

form.addEventListener("click", (event) => {
  const addKey = event.target.dataset.add;
  const removeKey = event.target.dataset.remove;

  if (addKey) {
    resume[addKey].push(clone(sectionConfig[addKey].template));
    persist();
    renderForm();
    renderPreview();
  }

  if (removeKey) {
    resume[removeKey].splice(Number(event.target.dataset.index), 1);
    persist();
    renderForm();
    renderPreview();
  }
});

styleSelect.addEventListener("change", () => {
  resume.style = styleSelect.value;
  persist();
  renderPreview();
});

document.querySelector("#photoInput").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    resume.basics.photo = reader.result;
    persist();
    renderPreview();
  });
  reader.readAsDataURL(file);
});

document.querySelector("#removePhotoButton").addEventListener("click", () => {
  resume.basics.photo = "";
  document.querySelector("#photoInput").value = "";
  persist();
  renderPreview();
});

document.querySelector("#resetButton").addEventListener("click", () => {
  resume = clone(defaultResume);
  persist();
  renderForm();
  renderPreview();
});

document.querySelector("#importButton").addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      resume = mergeResume(defaultResume, JSON.parse(reader.result));
      persist();
      renderForm();
      renderPreview();
    } catch {
      alert("JSON 文件格式不正确。");
    } finally {
      importFile.value = "";
    }
  });
  reader.readAsText(file, "utf-8");
});

document.querySelector("#syncPreviewButton").addEventListener("click", () => {
  renderPreview();
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const format = exportFormat.value;
  const name = safeFileName(resume.basics.name || "resume");

  if (format === "pdf") {
    preparePrintTitle();
    fitResumeToSinglePage();
    setTimeout(() => window.print(), 0);
    return;
  }

  if (format === "html") {
    downloadFile(`${name}.html`, buildStandaloneHtml(), "text/html;charset=utf-8");
    return;
  }

  if (format === "markdown") {
    downloadFile(`${name}.md`, toMarkdown(), "text/markdown;charset=utf-8");
    return;
  }

  downloadFile(`${name}.json`, JSON.stringify(resume, null, 2), "application/json;charset=utf-8");
});

window.addEventListener("beforeprint", fitResumeToSinglePage);
window.addEventListener("afterprint", cleanupAfterPrint);

function preparePrintTitle() {
  if (!originalTitleForPrint) {
    originalTitleForPrint = document.title;
  }
  document.title = `${resume.basics.name || "简历"} - 简历`;
}

function fitResumeToSinglePage() {
  const layout = preview.querySelector(".resume-layout");
  if (!layout) return 1;

  preview.style.setProperty("--print-scale", "1");

  const pageWidth = preview.getBoundingClientRect().width || 794;
  const pageHeight = pageWidth * (297 / 210);
  const contentWidth = layout.scrollWidth;
  const contentHeight = layout.scrollHeight;
  const scale = Math.min(1, pageWidth / (contentWidth + 1), pageHeight / (contentHeight + 12));
  const safeScale = Math.floor(Math.max(0.62, scale) * 1000) / 1000;

  preview.style.setProperty("--print-scale", String(safeScale));
  preview.dataset.printScale = String(safeScale);
  return safeScale;
}

function cleanupAfterPrint() {
  preview.style.removeProperty("--print-scale");
  delete preview.dataset.printScale;
  if (originalTitleForPrint) {
    document.title = originalTitleForPrint;
    originalTitleForPrint = "";
  }
}

function buildStandaloneHtml() {
  const page = preview.cloneNode(true);
  page.removeAttribute("contenteditable");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(resume.basics.name || "简历")}</title>
  <style>${collectCss()}</style>
</head>
<body>
  ${page.outerHTML}
</body>
</html>`;
}

function collectCss() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");
}

function toMarkdown() {
  const contactLine = [resume.basics.phone, resume.basics.email, resume.basics.location, resume.basics.website]
    .filter(Boolean)
    .join(" | ");
  const basicLine = [
    ["出生", resume.basics.birthday],
    ["学校", resume.basics.school],
    ["政治面貌", resume.basics.political]
  ]
    .filter(([, value]) => String(value || "").trim())
    .map(([label, value]) => `${label}：${value}`)
    .join(" | ");

  const lines = [
    `# ${resume.basics.name || "姓名"}`,
    "",
    `**${resume.basics.title || "求职方向"}**`,
    "",
    ...[contactLine, basicLine].filter(Boolean).flatMap((line) => [line, ""]),
    "## 个人简介",
    resume.basics.summary || "",
    "",
    "## 技能标签",
    resume.skills.join("、"),
    "",
    ...sectionToMarkdown("教育经历", resume.education, educationMarkdown),
    ...sectionToMarkdown("工作经历", resume.work, workMarkdown),
    ...sectionToMarkdown("项目经历", resume.projects, projectMarkdown),
    ...sectionToMarkdown("成果 / 获奖", resume.awards, awardMarkdown)
  ];

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function sectionToMarkdown(title, items, mapper) {
  const visibleItems = items.filter(hasContent);
  if (!visibleItems.length) return [];
  return [`## ${title}`, "", ...visibleItems.flatMap(mapper), ""];
}

function educationMarkdown(item) {
  return [
    `### ${item.school || "学校"} | ${dateRange(item.start, item.end)}`,
    [item.degree, item.major, item.location].filter(Boolean).join(" | "),
    ...bulletMarkdown(item.details),
    ""
  ];
}

function workMarkdown(item) {
  return [
    `### ${item.company || "公司"} | ${dateRange(item.start, item.end)}`,
    [item.role, item.location].filter(Boolean).join(" | "),
    ...bulletMarkdown(item.details),
    ""
  ];
}

function projectMarkdown(item) {
  return [
    `### ${item.name || "项目"} | ${dateRange(item.start, item.end)}`,
    [item.role, item.tech].filter(Boolean).join(" | "),
    ...bulletMarkdown(item.details),
    ""
  ];
}

function awardMarkdown(item) {
  return [
    `### ${item.name || "成果 / 奖项"} | ${item.date || ""}`,
    [item.issuer, item.description].filter(Boolean).join(" | "),
    ""
  ];
}

function bulletMarkdown(items) {
  return Array.isArray(items) ? items.map((item) => `- ${item}`) : [];
}

function downloadFile(fileName, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function safeFileName(name) {
  return String(name).trim().replace(/[\\/:*?"<>|]+/g, "_") || "resume";
}

renderForm();
renderPreview();
