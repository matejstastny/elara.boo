export const identity = {
    given: "Matej",
    chosen: "Ellie",
    surnameStem: "Stastn",
    surnameOld: "y",
    surnameNew: "a",
    full: "Ellie Stastna",
    handle: "elara",
    domain: "elara.boo",
} as const;

export const contact = {
    links: [
        {
            label: "GitHub",
            handle: "matejstastny",
            href: "https://github.com/matejstastny",
            icon: "github" as const,
        },
        {
            label: "LinkedIn",
            handle: "matejstastny",
            href: "https://www.linkedin.com/in/matejstastny/",
            icon: "linkedin" as const,
        },
        {
            label: "Email",
            handle: "matysta@outlook.com",
            href: "mailto:matysta@outlook.com",
            icon: "mail" as const,
        },
        {
            label: "Discord",
            handle: "my_daarlin",
            href: "https://discord.com/users/917095787735941141",
            icon: "discord" as const,
        },
        { label: "Résumé", handle: "PDF", href: "/resume.pdf", icon: "doc" as const },
    ],
} as const;

export const meta = {
    title: `${identity.full} · ${identity.domain}`,
    description:
        "Ellie Stastna - Simulation Team Lead at TrickFire Robotics, computer engineering at UW Bothell. ROS 2 and Gazebo simulation, internal tooling and infrastructure, Linux.",
} as const;

export const hero = {
    lines: [
        "Simulation Team Lead at TrickFire Robotics",
        "Computer Engineering at UW Bothell · Seattle",
    ],
    blurb: "I build the simulation, tooling and infrastructure a student Mars rover team runs on, and Linux things for myself.",
} as const;

/** grouped for the two rows under the hero; labels come from src/data/tech.ts */
export const techGroups = [
    { label: "languages", slugs: ["typescript", "python", "rust", "openjdk", "gnubash"] },
    {
        label: "stack",
        slugs: [
            "linux",
            "ros",
            "docker",
            "nextdotjs",
            "react",
            "astro",
            "tailwindcss",
            "sqlite",
            "tauri",
            "git",
        ],
    },
] as const;

export const trickfire = {
    org: "TrickFire Robotics",
    href: "https://github.com/TrickfireRobotics",
    site: "https://trickfirerobotics.com",
    role: "Simulation Team Lead",
    since: "2025",
    blurb: "A student-led team at UW Bothell, competing in the University Rover Challenge, four missions on a Mars analogue. Everything is designed and built by students. I lead simulation, and I look after the software and infrastructure the rest of the team leans on. Most of my time currently goes into this.",
    competition: "University Rover Challenge",
    competitionHref: "https://urc.marssociety.org/",
    docs: "https://docs.trickfirerobotics.com",
    mark: "/img/trickfire.webp",
    photo: {
        src: "/img/team-900.webp",
        srcset: "/img/team-900.webp 900w, /img/team-1400.webp 1400w",
        alt: "Team group photo in the ARC with the rover during its unveiling, 2025",
        caption: "the team with our robot viator",
    },
    work: [
        {
            name: "simulation framework",
            repo: "simulations",
            href: "https://github.com/TrickFireRobotics/simulations",
            body: "Gazebo Harmonic for the robot with its subsystems & the coms drone, Project Chrono for terrain and wheel physics, both behind a single sim CLI. Built with my team to run the same on anyone's machine and to make adding a model simple and intuitive. A lot of our engineers are mechanical, not software + new member should be able to drive a rover on their first day.",
            tags: ["ROS 2 Jazzy", "Gazebo", "Project Chrono", "Python", "Docker"],
            icon: "rover" as const,
            shots: [
                {
                    src: "/img/sim-b-900.webp",
                    srcset: "/img/sim-b-900.webp 900w, /img/sim-b-1400.webp 1400w",
                    alt: "A rover arm in a Gazebo 3D scene, with a joint trajectory controller panel driving the elbow, shoulder and wrist joints.",
                    caption: "driving the robot's arm's joint trajectory controller in Gazebo",
                },
                {
                    src: "/img/sim-a-900.webp",
                    srcset: "/img/sim-a-900.webp 900w, /img/sim-a-1400.webp 1400w",
                    alt: "Gazebo Sim open beside QGroundControl, which shows a satellite map of the UW campus with the aircraft marker on it.",
                    caption: "the drone in Gazebo, flown from QGroundControl over campus",
                },
            ],
        },
        {
            name: "trickfire-docs",
            repo: "trickfire-docs",
            href: "https://github.com/TrickfireRobotics/docs",
            body: "A documentation framework for the whole organisation. A repo adds one dev dependency, writes MDX and a JSON config, and its pages show up on the org docs site without building code or copying template files. A self-hosted server pulls from every repo and builds them into a single Fumadocs site.",
            tags: ["typescript", "next.js", "fumadocs", "mdx", "npm"],
            icon: "doc" as const,
            link: {
                label: "docs.trickfirerobotics.com",
                href: "https://docs.trickfirerobotics.com",
            },
        },
        {
            name: "internal dashboard",
            repo: "dashboard",
            href: "https://github.com/TrickfireRobotics/dashboard",
            body: "The club's internal portal, in production and used by the team. Members file part orders and server requests, officers review and action them. Next.js on the App Router, SQLite through Drizzle, session auth, on our own hardware.",
            tags: ["next.js", "drizzle", "sqlite", "better-auth", "tailwind"],
            icon: "grid" as const,
        },
        {
            name: "servers and network",
            repo: "",
            href: "",
            body: "I co-administer the team's internal infrastructure, including our server, the router and the tailnet that ties them together.",
            tags: ["debian", "tailscale", "cloudflare", "nginx", "self-hosted"],
            icon: "server" as const,
        },
    ],
} as const;

export const projects = [
    {
        name: "azalea",
        tagline: "modpacks from the terminal",
        body: "Resolves and unresolves Modrinth dependencies, tells you whether a pack survives a Minecraft version bump before you take it, exports .mrpack, and can stand a server up instantly from the same source.",
        tags: ["Python", "Modrinth API"],
        status: "maintained",
        href: "https://github.com/matejstastny/azalea",
        image: "/img/azalea.webp",
    },
    {
        name: "glowberry",
        tagline: "a launcher that opens before you let go of the mouse",
        body: "A ~10 MB Tauri app in Rust and React. Signed auto-updates through a release pipeline I set up, modpack updates that do not clobber your keybinds, and no storefront anywhere in it.",
        tags: ["Rust", "Tauri", "React"],
        status: "maintained",
        href: "https://github.com/matejstastny/glowberry",
        image: "/img/glowberry.webp",
    },
    {
        name: "iris",
        tagline: "a terminal that knows where you are",
        body: "Workspaces per project, tabs that are a git view or a container or an SSH session rather than just another shell, and state that survives closing the app. Should be like tmux but built in the terminal itself.",
        tags: ["Rust", "Tauri", "React"],
        status: "early development",
        href: "https://github.com/matejstastny/iris",
        image: "/img/iris.webp",
    },
    {
        name: "flaggi",
        tagline: "a multiplayer game, written from the socket up",
        body: "Real-time 2D capture the flag in Java with almost none external dependencies, a from scratch rednering & physics engines. Uses a shared module to share code between the client and server apps.",
        tags: ["Java", "Gradle", "Sockets"],
        status: "finished",
        href: "https://github.com/matejstastny/flaggi",
        image: "/img/flaggi.webp",
    },
] as const;

export const linux = {
    blurb: "My laptop is a 2022 MacBook Air M2 running Fedora Asahi Remix on a kernel I compile myself to enable external display over USB-C (fairydust branch). I spend a lot of time around that community and help where I can. I plan contributing properly upstream when I get skilled enough <3",
    links: [
        {
            label: "Asahi Linux",
            href: "https://asahilinux.org",
            detail: "linux kernel for apple silicon",
        },
        {
            label: "fairydust display builder",
            href: "https://github.com/bharambetejas/asahi-fairydust-display",
            detail: "contributed",
        },
        {
            label: "dotfiles",
            href: "https://github.com/matejstastny/dotfiles",
            detail: "hyprland with a custom 7k line QML shell",
        },
    ],
    caption: "showcase video of my setup",
    alt: "A dark Hyprland desktop: a deep indigo Jupiter wallpaper, a thin Waybar along the top, and a kitty terminal showing fastfetch output for Fedora Asahi Remix on an Apple M2.",
} as const;

export const name = {
    body: "Elara is one of Jupiter's moons. It starts with el, same as Ellie, and space is extremely cool, which is the whole of the reasoning. Every machine I own is named after a moon out there somewhere :3",
} as const;

export const education = {
    school: "University of Washington Bothell",
    degree: "B.S. Computer Engineering",
    window: "expected June 2029",
    facts: [
        ["gpa", "3.85"],
        ["honours", "Dean's List, Autumn 2025 & Spring 2026"],
        ["program", "STARS, for first-generation students"],
        ["work", "STARS Program Assistant"],
    ],
} as const;

export const footer = {
    source: "https://github.com/matejstastny/elara.boo",
} as const;
