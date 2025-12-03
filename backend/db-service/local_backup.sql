--
-- PostgreSQL database dump
--

\restrict VM8rlABbVvAXruaqKbSa6rGRab0gN3M16SbZY8T6MtB1hzoc2PIWlIpD9OM0xNI

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'student',
    'faculty'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Courses" (
    id integer NOT NULL,
    code text NOT NULL,
    title text NOT NULL,
    "facultyId" integer NOT NULL,
    capacity integer
);


ALTER TABLE public."Courses" OWNER TO postgres;

--
-- Name: Courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Courses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Courses_id_seq" OWNER TO postgres;

--
-- Name: Courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Courses_id_seq" OWNED BY public."Courses".id;


--
-- Name: Enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollments" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    "studentId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Enrollments" OWNER TO postgres;

--
-- Name: Enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Enrollments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Enrollments_id_seq" OWNER TO postgres;

--
-- Name: Enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Enrollments_id_seq" OWNED BY public."Enrollments".id;


--
-- Name: Grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Grades" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    "studentId" integer NOT NULL,
    grade text NOT NULL,
    term text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Grades" OWNER TO postgres;

--
-- Name: Grades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Grades_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Grades_id_seq" OWNER TO postgres;

--
-- Name: Grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Grades_id_seq" OWNED BY public."Grades".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses" ALTER COLUMN id SET DEFAULT nextval('public."Courses_id_seq"'::regclass);


--
-- Name: Enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments" ALTER COLUMN id SET DEFAULT nextval('public."Enrollments_id_seq"'::regclass);


--
-- Name: Grades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Grades" ALTER COLUMN id SET DEFAULT nextval('public."Grades_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Courses" (id, code, title, "facultyId", capacity) FROM stdin;
1	CS101	Introduction to CS	1	5
2	MATH201	Advanced Calculus	2	5
3	PHY150	Physics I	1	5
4	ENG100	English Composition	3	3
5	HIST202	World History	2	5
\.


--
-- Data for Name: Enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollments" (id, "courseId", "studentId", "createdAt") FROM stdin;
1	1	4	2025-11-29 06:17:34.093
2	1	5	2025-11-29 06:17:34.095
3	1	6	2025-11-29 06:17:34.097
4	1	7	2025-11-29 06:17:34.098
5	2	8	2025-11-29 06:17:34.1
6	2	9	2025-11-29 06:17:34.102
7	3	4	2025-11-29 06:17:34.103
8	3	6	2025-11-29 06:17:34.105
9	3	8	2025-11-29 06:17:34.106
10	3	10	2025-11-29 06:17:34.107
11	4	5	2025-11-29 06:17:34.109
12	4	7	2025-11-29 06:17:34.11
13	4	11	2025-11-29 06:17:34.111
14	5	9	2025-11-29 06:17:34.112
\.


--
-- Data for Name: Grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Grades" (id, "courseId", "studentId", grade, term, "createdAt") FROM stdin;
1	1	4	A	2024 Term 1	2025-11-29 06:17:34.115
2	1	5	B+	2024 Term 1	2025-11-29 06:17:34.118
3	1	6	A-	2024 Term 1	2025-11-29 06:17:34.119
4	2	8	A	2024 Term 1	2025-11-29 06:17:34.121
5	2	9	B	2024 Term 1	2025-11-29 06:17:34.122
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, email, "passwordHash", role) FROM stdin;
1	prof.jane@school.com	$2b$10$FLBn9Ffih.5LkYL/JkNeX.2bMiX1Wy1AzHh4zF.gVeB24g9ZwbgE6	faculty
2	prof.john@school.com	$2b$10$cn61iegW9ARnJXthsmTB8uSryVww2G3ZHB5ctIKqq9zvqFzdSLMja	faculty
3	prof.maria@school.com	$2b$10$awhu7cb89MjwaxeLTHfobu08/mrieWkkX.mWQ1LQzXvB.XqfnrHUK	faculty
4	student.anna@school.com	$2b$10$iySNfAP2HnL4ExXBN6Ij1.gXDSpPVYESsdSnhCI0cbsVvVIe3V49O	student
5	student.ben@school.com	$2b$10$XUW3t3sRkZpiZd6mb.plyO4uZdXP/Rne3fJMNuWmd0zSN4Deu24m6	student
6	student.cara@school.com	$2b$10$n5Z8joeDCF4P/kIueYDuZu5gByNb5s/IoZYQ3aUD0ERZrpS3pTwOq	student
7	student.david@school.com	$2b$10$mgDOil7zSOIQUWoj/P7i6u/Da4y25r0e64xsMEN.ajkqMO18rkTpK	student
8	student.emma@school.com	$2b$10$E5iBpDiSDOQatlFVlreyFudjYDIvrT/be7EBISiODl7Ot2ZuhwbTG	student
9	student.frank@school.com	$2b$10$U6NwkxAgdjIQ8QIrmOVIs.hGYk.GDjFXZ33ml5inFHPv/HEFRsEBa	student
10	student.grace@school.com	$2b$10$F8ZfkQ9N.VaUmuCrytW9UeBDeD5LUWnHtNzvaHV8gV4YIEt6fcp4K	student
11	student.henry@school.com	$2b$10$zNTsrl0KCyvapKLMDghh8ucwzeolcUW/1R8ofQk7e/et9.YIa4FG.	student
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
aacf0671-88f0-4ad0-bcd0-e6ff8156a3dd	239fc9d01ba65a1c4cac72ce376defda3fdb04441abc840f20a2a66973b07fe7	2025-11-29 14:17:31.95669+08	20251129061701_edit_seed	\N	\N	2025-11-29 14:17:31.925433+08	1
\.


--
-- Name: Courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Courses_id_seq"', 5, true);


--
-- Name: Enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Enrollments_id_seq"', 14, true);


--
-- Name: Grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Grades_id_seq"', 5, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 11, true);


--
-- Name: Courses Courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "Courses_pkey" PRIMARY KEY (id);


--
-- Name: Enrollments Enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_pkey" PRIMARY KEY (id);


--
-- Name: Grades Grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Grades"
    ADD CONSTRAINT "Grades_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: Courses Courses_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "Courses_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollments Enrollments_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollments Enrollments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollments"
    ADD CONSTRAINT "Enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Grades Grades_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Grades"
    ADD CONSTRAINT "Grades_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Grades Grades_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Grades"
    ADD CONSTRAINT "Grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict VM8rlABbVvAXruaqKbSa6rGRab0gN3M16SbZY8T6MtB1hzoc2PIWlIpD9OM0xNI

