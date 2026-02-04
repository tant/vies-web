--
-- PostgreSQL database dump
--

\restrict 16ojVlj2Dg6CS2SfHO1bUEVchsQcyE5WkUwOtM2aLairhktGTdTvFsdzWwXGeQB

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
-- Name: _locales; Type: TYPE; Schema: public; Owner: vies
--

CREATE TYPE public._locales AS ENUM (
    'vi',
    'en',
    'km'
);


ALTER TYPE public._locales OWNER TO vies;

--
-- Name: enum_news_status; Type: TYPE; Schema: public; Owner: vies
--

CREATE TYPE public.enum_news_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_news_status OWNER TO vies;

--
-- Name: enum_products_status; Type: TYPE; Schema: public; Owner: vies
--

CREATE TYPE public.enum_products_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.enum_products_status OWNER TO vies;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    logo_id integer,
    website character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brands OWNER TO vies;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO vies;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: brands_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.brands_locales (
    description jsonb,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.brands_locales OWNER TO vies;

--
-- Name: brands_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.brands_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_locales_id_seq OWNER TO vies;

--
-- Name: brands_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.brands_locales_id_seq OWNED BY public.brands_locales.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    slug character varying NOT NULL,
    image_id integer,
    parent_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO vies;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO vies;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: categories_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.categories_locales (
    name character varying NOT NULL,
    description jsonb,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.categories_locales OWNER TO vies;

--
-- Name: categories_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.categories_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_locales_id_seq OWNER TO vies;

--
-- Name: categories_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.categories_locales_id_seq OWNED BY public.categories_locales.id;


--
-- Name: footer; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.footer (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


ALTER TABLE public.footer OWNER TO vies;

--
-- Name: footer_columns; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.footer_columns (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL
);


ALTER TABLE public.footer_columns OWNER TO vies;

--
-- Name: footer_columns_links; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.footer_columns_links (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    url character varying NOT NULL
);


ALTER TABLE public.footer_columns_links OWNER TO vies;

--
-- Name: footer_columns_links_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.footer_columns_links_locales (
    label character varying NOT NULL,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);


ALTER TABLE public.footer_columns_links_locales OWNER TO vies;

--
-- Name: footer_columns_links_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.footer_columns_links_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_columns_links_locales_id_seq OWNER TO vies;

--
-- Name: footer_columns_links_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.footer_columns_links_locales_id_seq OWNED BY public.footer_columns_links_locales.id;


--
-- Name: footer_columns_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.footer_columns_locales (
    title character varying NOT NULL,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);


ALTER TABLE public.footer_columns_locales OWNER TO vies;

--
-- Name: footer_columns_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.footer_columns_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_columns_locales_id_seq OWNER TO vies;

--
-- Name: footer_columns_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.footer_columns_locales_id_seq OWNED BY public.footer_columns_locales.id;


--
-- Name: footer_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.footer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_id_seq OWNER TO vies;

--
-- Name: footer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.footer_id_seq OWNED BY public.footer.id;


--
-- Name: footer_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.footer_locales (
    copyright character varying DEFAULT '© 2026 VIES. All rights reserved.'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.footer_locales OWNER TO vies;

--
-- Name: footer_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.footer_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_locales_id_seq OWNER TO vies;

--
-- Name: footer_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.footer_locales_id_seq OWNED BY public.footer_locales.id;


--
-- Name: header; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.header (
    id integer NOT NULL,
    top_bar_enabled boolean DEFAULT true,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


ALTER TABLE public.header OWNER TO vies;

--
-- Name: header_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.header_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.header_id_seq OWNER TO vies;

--
-- Name: header_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.header_id_seq OWNED BY public.header.id;


--
-- Name: header_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.header_locales (
    top_bar_content character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.header_locales OWNER TO vies;

--
-- Name: header_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.header_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.header_locales_id_seq OWNER TO vies;

--
-- Name: header_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.header_locales_id_seq OWNED BY public.header_locales.id;


--
-- Name: header_navigation; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.header_navigation (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    link character varying NOT NULL
);


ALTER TABLE public.header_navigation OWNER TO vies;

--
-- Name: header_navigation_children; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.header_navigation_children (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    link character varying NOT NULL
);


ALTER TABLE public.header_navigation_children OWNER TO vies;

--
-- Name: header_navigation_children_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.header_navigation_children_locales (
    label character varying NOT NULL,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);


ALTER TABLE public.header_navigation_children_locales OWNER TO vies;

--
-- Name: header_navigation_children_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.header_navigation_children_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.header_navigation_children_locales_id_seq OWNER TO vies;

--
-- Name: header_navigation_children_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.header_navigation_children_locales_id_seq OWNED BY public.header_navigation_children_locales.id;


--
-- Name: header_navigation_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.header_navigation_locales (
    label character varying NOT NULL,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);


ALTER TABLE public.header_navigation_locales OWNER TO vies;

--
-- Name: header_navigation_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.header_navigation_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.header_navigation_locales_id_seq OWNER TO vies;

--
-- Name: header_navigation_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.header_navigation_locales_id_seq OWNED BY public.header_navigation_locales.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.media (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


ALTER TABLE public.media OWNER TO vies;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_id_seq OWNER TO vies;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: media_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.media_locales (
    alt character varying NOT NULL,
    caption character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.media_locales OWNER TO vies;

--
-- Name: media_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.media_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_locales_id_seq OWNER TO vies;

--
-- Name: media_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.media_locales_id_seq OWNED BY public.media_locales.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.news (
    id integer NOT NULL,
    slug character varying NOT NULL,
    featured_image_id integer,
    published_at timestamp(3) with time zone,
    status public.enum_news_status DEFAULT 'draft'::public.enum_news_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news OWNER TO vies;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO vies;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: news_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.news_locales (
    title character varying NOT NULL,
    excerpt character varying,
    content jsonb,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.news_locales OWNER TO vies;

--
-- Name: news_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.news_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_locales_id_seq OWNER TO vies;

--
-- Name: news_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.news_locales_id_seq OWNED BY public.news_locales.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE public.payload_kv OWNER TO vies;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_kv_id_seq OWNER TO vies;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_locked_documents OWNER TO vies;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_id_seq OWNER TO vies;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    categories_id integer,
    brands_id integer,
    products_id integer,
    news_id integer
);


ALTER TABLE public.payload_locked_documents_rels OWNER TO vies;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNER TO vies;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_migrations OWNER TO vies;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_migrations_id_seq OWNER TO vies;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_preferences OWNER TO vies;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_id_seq OWNER TO vies;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


ALTER TABLE public.payload_preferences_rels OWNER TO vies;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNER TO vies;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.products (
    id integer NOT NULL,
    slug character varying NOT NULL,
    sku character varying,
    brand_id integer,
    featured boolean DEFAULT false,
    status public.enum_products_status DEFAULT 'draft'::public.enum_products_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO vies;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO vies;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: products_images; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.products_images (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer NOT NULL
);


ALTER TABLE public.products_images OWNER TO vies;

--
-- Name: products_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.products_locales (
    name character varying NOT NULL,
    description jsonb,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.products_locales OWNER TO vies;

--
-- Name: products_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.products_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_locales_id_seq OWNER TO vies;

--
-- Name: products_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.products_locales_id_seq OWNED BY public.products_locales.id;


--
-- Name: products_rels; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.products_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    categories_id integer
);


ALTER TABLE public.products_rels OWNER TO vies;

--
-- Name: products_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.products_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_rels_id_seq OWNER TO vies;

--
-- Name: products_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.products_rels_id_seq OWNED BY public.products_rels.id;


--
-- Name: products_specifications; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.products_specifications (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL
);


ALTER TABLE public.products_specifications OWNER TO vies;

--
-- Name: products_specifications_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.products_specifications_locales (
    key character varying NOT NULL,
    value character varying NOT NULL,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);


ALTER TABLE public.products_specifications_locales OWNER TO vies;

--
-- Name: products_specifications_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.products_specifications_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_specifications_locales_id_seq OWNER TO vies;

--
-- Name: products_specifications_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.products_specifications_locales_id_seq OWNED BY public.products_specifications_locales.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    site_name character varying DEFAULT 'VIES'::character varying NOT NULL,
    logo_id integer,
    favicon_id integer,
    contact_email character varying,
    social_facebook character varying,
    social_zalo character varying,
    social_youtube character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


ALTER TABLE public.site_settings OWNER TO vies;

--
-- Name: site_settings_contact_phone; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.site_settings_contact_phone (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    number character varying NOT NULL
);


ALTER TABLE public.site_settings_contact_phone OWNER TO vies;

--
-- Name: site_settings_contact_phone_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.site_settings_contact_phone_locales (
    label character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);


ALTER TABLE public.site_settings_contact_phone_locales OWNER TO vies;

--
-- Name: site_settings_contact_phone_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.site_settings_contact_phone_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_contact_phone_locales_id_seq OWNER TO vies;

--
-- Name: site_settings_contact_phone_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.site_settings_contact_phone_locales_id_seq OWNED BY public.site_settings_contact_phone_locales.id;


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO vies;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: site_settings_locales; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.site_settings_locales (
    contact_address character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);


ALTER TABLE public.site_settings_locales OWNER TO vies;

--
-- Name: site_settings_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.site_settings_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_locales_id_seq OWNER TO vies;

--
-- Name: site_settings_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.site_settings_locales_id_seq OWNED BY public.site_settings_locales.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.users (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


ALTER TABLE public.users OWNER TO vies;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: vies
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO vies;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vies
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: vies
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


ALTER TABLE public.users_sessions OWNER TO vies;

--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: brands_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.brands_locales ALTER COLUMN id SET DEFAULT nextval('public.brands_locales_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: categories_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories_locales ALTER COLUMN id SET DEFAULT nextval('public.categories_locales_id_seq'::regclass);


--
-- Name: footer id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer ALTER COLUMN id SET DEFAULT nextval('public.footer_id_seq'::regclass);


--
-- Name: footer_columns_links_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_links_locales ALTER COLUMN id SET DEFAULT nextval('public.footer_columns_links_locales_id_seq'::regclass);


--
-- Name: footer_columns_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_locales ALTER COLUMN id SET DEFAULT nextval('public.footer_columns_locales_id_seq'::regclass);


--
-- Name: footer_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_locales ALTER COLUMN id SET DEFAULT nextval('public.footer_locales_id_seq'::regclass);


--
-- Name: header id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header ALTER COLUMN id SET DEFAULT nextval('public.header_id_seq'::regclass);


--
-- Name: header_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_locales ALTER COLUMN id SET DEFAULT nextval('public.header_locales_id_seq'::regclass);


--
-- Name: header_navigation_children_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_children_locales ALTER COLUMN id SET DEFAULT nextval('public.header_navigation_children_locales_id_seq'::regclass);


--
-- Name: header_navigation_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_locales ALTER COLUMN id SET DEFAULT nextval('public.header_navigation_locales_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: media_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.media_locales ALTER COLUMN id SET DEFAULT nextval('public.media_locales_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: news_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.news_locales ALTER COLUMN id SET DEFAULT nextval('public.news_locales_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: products_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_locales ALTER COLUMN id SET DEFAULT nextval('public.products_locales_id_seq'::regclass);


--
-- Name: products_rels id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_rels ALTER COLUMN id SET DEFAULT nextval('public.products_rels_id_seq'::regclass);


--
-- Name: products_specifications_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_specifications_locales ALTER COLUMN id SET DEFAULT nextval('public.products_specifications_locales_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: site_settings_contact_phone_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_contact_phone_locales ALTER COLUMN id SET DEFAULT nextval('public.site_settings_contact_phone_locales_id_seq'::regclass);


--
-- Name: site_settings_locales id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_locales ALTER COLUMN id SET DEFAULT nextval('public.site_settings_locales_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.brands (id, name, slug, logo_id, website, updated_at, created_at) FROM stdin;
1	SKF	skf	\N	https://www.skf.com	2026-02-04 09:04:01.524+00	2026-02-04 09:04:01.523+00
2	FAG	fag	\N	https://www.schaeffler.com	2026-02-04 09:04:01.54+00	2026-02-04 09:04:01.54+00
3	NTN	ntn	\N	https://www.ntn.co.jp	2026-02-04 09:04:01.549+00	2026-02-04 09:04:01.549+00
4	TIMKEN	timken	\N	https://www.timken.com	2026-02-04 09:04:01.557+00	2026-02-04 09:04:01.557+00
5	INA	ina	\N	https://www.schaeffler.com	2026-02-04 09:04:01.565+00	2026-02-04 09:04:01.565+00
6	Lincoln	lincoln	\N	https://www.skf.com/lincoln	2026-02-04 09:04:01.572+00	2026-02-04 09:04:01.572+00
7	Optibelt	optibelt	\N	https://www.optibelt.com	2026-02-04 09:04:01.581+00	2026-02-04 09:04:01.581+00
8	SMC	smc	\N	https://www.smc.eu	2026-02-04 09:04:01.588+00	2026-02-04 09:04:01.588+00
\.


--
-- Data for Name: brands_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.brands_locales (description, id, _locale, _parent_id) FROM stdin;
"Thương hiệu vòng bi hàng đầu thế giới từ Thụy Điển"	1	vi	1
"Thương hiệu vòng bi cao cấp từ Đức, thuộc tập đoàn Schaeffler"	2	vi	2
"Thương hiệu vòng bi Nhật Bản với công nghệ tiên tiến"	3	vi	3
"Thương hiệu vòng bi Mỹ với hơn 100 năm kinh nghiệm"	4	vi	4
"Chuyên gia về hệ thống truyền động tịnh tiến"	5	vi	5
"Hệ thống bôi trơn tự động hàng đầu"	6	vi	6
"Dây đai truyền động chất lượng cao từ Đức"	7	vi	7
"Thiết bị khí nén công nghiệp Nhật Bản"	8	vi	8
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.categories (id, slug, image_id, parent_id, updated_at, created_at) FROM stdin;
1	vong-bi	\N	\N	2026-02-04 09:04:01.597+00	2026-02-04 09:04:01.597+00
2	boi-tron	\N	\N	2026-02-04 09:04:01.605+00	2026-02-04 09:04:01.605+00
3	dung-cu-bao-tri	\N	\N	2026-02-04 09:04:01.613+00	2026-02-04 09:04:01.613+00
4	truyen-dong	\N	\N	2026-02-04 09:04:01.627+00	2026-02-04 09:04:01.627+00
5	goi-do	\N	\N	2026-02-04 09:04:01.634+00	2026-02-04 09:04:01.634+00
6	khi-nen	\N	\N	2026-02-04 09:04:01.641+00	2026-02-04 09:04:01.641+00
\.


--
-- Data for Name: categories_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.categories_locales (name, description, id, _locale, _parent_id) FROM stdin;
Vòng bi	"Các loại vòng bi công nghiệp chính hãng"	1	vi	1
Bôi trơn	"Mỡ bôi trơn và hệ thống bôi trơn tự động"	2	vi	2
Dụng cụ bảo trì	"Thiết bị và dụng cụ bảo trì công nghiệp"	3	vi	3
Truyền động	"Dây đai, xích và các sản phẩm truyền động"	4	vi	4
Gối đỡ	"Gối đỡ và cụm vòng bi"	5	vi	5
Khí nén	"Thiết bị khí nén công nghiệp"	6	vi	6
\.


--
-- Data for Name: footer; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.footer (id, updated_at, created_at) FROM stdin;
1	2026-02-04 09:04:02.632+00	2026-02-04 09:04:02.632+00
\.


--
-- Data for Name: footer_columns; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.footer_columns (_order, _parent_id, id) FROM stdin;
1	1	69830b82789dc04148ca080b
2	1	69830b82789dc04148ca080f
3	1	69830b82789dc04148ca0812
\.


--
-- Data for Name: footer_columns_links; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.footer_columns_links (_order, _parent_id, id, url) FROM stdin;
1	69830b82789dc04148ca080b	69830b82789dc04148ca0807	/products?brand=skf
2	69830b82789dc04148ca080b	69830b82789dc04148ca0808	/products?brand=fag
3	69830b82789dc04148ca080b	69830b82789dc04148ca0809	/products?brand=ntn
4	69830b82789dc04148ca080b	69830b82789dc04148ca080a	/products?category=dung-cu-bao-tri
1	69830b82789dc04148ca080f	69830b82789dc04148ca080c	/contact
2	69830b82789dc04148ca080f	69830b82789dc04148ca080d	/contact
3	69830b82789dc04148ca080f	69830b82789dc04148ca080e	/contact
1	69830b82789dc04148ca0812	69830b82789dc04148ca0810	tel:+84963048317
2	69830b82789dc04148ca0812	69830b82789dc04148ca0811	mailto:info@v-ies.com
\.


--
-- Data for Name: footer_columns_links_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.footer_columns_links_locales (label, id, _locale, _parent_id) FROM stdin;
Vòng bi SKF	1	vi	69830b82789dc04148ca0807
Vòng bi FAG	2	vi	69830b82789dc04148ca0808
Vòng bi NTN	3	vi	69830b82789dc04148ca0809
Dụng cụ bảo trì	4	vi	69830b82789dc04148ca080a
Tư vấn kỹ thuật	5	vi	69830b82789dc04148ca080c
Kiểm tra hàng chính hãng	6	vi	69830b82789dc04148ca080d
Bảo hành	7	vi	69830b82789dc04148ca080e
Hotline: (+84) 963 048 317	8	vi	69830b82789dc04148ca0810
Email: info@v-ies.com	9	vi	69830b82789dc04148ca0811
\.


--
-- Data for Name: footer_columns_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.footer_columns_locales (title, id, _locale, _parent_id) FROM stdin;
Sản phẩm	1	vi	69830b82789dc04148ca080b
Dịch vụ	2	vi	69830b82789dc04148ca080f
Liên hệ	3	vi	69830b82789dc04148ca0812
\.


--
-- Data for Name: footer_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.footer_locales (copyright, id, _locale, _parent_id) FROM stdin;
© 2026 VIES. Công ty TNHH TM & DV VIES. MST: 0318321326	1	vi	1
\.


--
-- Data for Name: header; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.header (id, top_bar_enabled, updated_at, created_at) FROM stdin;
1	t	2026-02-04 09:04:02.366+00	2026-02-04 09:04:02.366+00
\.


--
-- Data for Name: header_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.header_locales (top_bar_content, id, _locale, _parent_id) FROM stdin;
Hotline: (+84) 963 048 317 | Email: info@v-ies.com	1	vi	1
\.


--
-- Data for Name: header_navigation; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.header_navigation (_order, _parent_id, id, link) FROM stdin;
1	1	69830b82789dc04148ca07fe	/
2	1	69830b82789dc04148ca0803	/products
3	1	69830b82789dc04148ca0804	/brands
4	1	69830b82789dc04148ca0805	/news
5	1	69830b82789dc04148ca0806	/contact
\.


--
-- Data for Name: header_navigation_children; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.header_navigation_children (_order, _parent_id, id, link) FROM stdin;
1	69830b82789dc04148ca0803	69830b82789dc04148ca07ff	/products?category=vong-bi
2	69830b82789dc04148ca0803	69830b82789dc04148ca0800	/products?category=boi-tron
3	69830b82789dc04148ca0803	69830b82789dc04148ca0801	/products?category=dung-cu-bao-tri
4	69830b82789dc04148ca0803	69830b82789dc04148ca0802	/products?category=truyen-dong
\.


--
-- Data for Name: header_navigation_children_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.header_navigation_children_locales (label, id, _locale, _parent_id) FROM stdin;
Vòng bi	1	vi	69830b82789dc04148ca07ff
Bôi trơn	2	vi	69830b82789dc04148ca0800
Dụng cụ bảo trì	3	vi	69830b82789dc04148ca0801
Truyền động	4	vi	69830b82789dc04148ca0802
\.


--
-- Data for Name: header_navigation_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.header_navigation_locales (label, id, _locale, _parent_id) FROM stdin;
Trang chủ	1	vi	69830b82789dc04148ca07fe
Sản phẩm	2	vi	69830b82789dc04148ca0803
Thương hiệu	3	vi	69830b82789dc04148ca0804
Tin tức	4	vi	69830b82789dc04148ca0805
Liên hệ	5	vi	69830b82789dc04148ca0806
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.media (id, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y) FROM stdin;
\.


--
-- Data for Name: media_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.media_locales (alt, caption, id, _locale, _parent_id) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.news (id, slug, featured_image_id, published_at, status, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: news_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.news_locales (title, excerpt, content, id, _locale, _parent_id) FROM stdin;
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, categories_id, brands_id, products_id, news_id) FROM stdin;
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
1	dev	-1	2026-02-04 11:00:39.73+00	2026-02-04 09:04:01.432+00
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.products (id, slug, sku, brand_id, featured, status, updated_at, created_at) FROM stdin;
1	skf-6205-2rs	6205-2RS	1	t	published	2026-02-04 09:04:01.654+00	2026-02-04 09:04:01.653+00
2	fag-nu206e	NU206E	2	t	published	2026-02-04 09:04:01.675+00	2026-02-04 09:04:01.675+00
3	skf-lgmt-3	LGMT 3/1	1	t	published	2026-02-04 09:04:01.692+00	2026-02-04 09:04:01.691+00
4	skf-tmbh-1	TMBH 1	1	f	published	2026-02-04 09:04:01.707+00	2026-02-04 09:04:01.707+00
5	optibelt-omega	OMEGA-HTD-8M	7	f	published	2026-02-04 09:04:01.724+00	2026-02-04 09:04:01.724+00
6	ntn-6308llu	6308LLU	3	t	published	2026-02-04 09:04:01.739+00	2026-02-04 09:04:01.739+00
\.


--
-- Data for Name: products_images; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.products_images (_order, _parent_id, id, image_id) FROM stdin;
\.


--
-- Data for Name: products_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.products_locales (name, description, id, _locale, _parent_id) FROM stdin;
Vòng bi cầu SKF 6205-2RS	"Vòng bi cầu một dãy, hai phớt cao su, chịu tải cao"	1	vi	1
Vòng bi đũa FAG NU206E	"Vòng bi đũa trụ chịu tải hướng tâm cao"	2	vi	2
Mỡ SKF LGMT 3	"Mỡ bôi trơn đa dụng cho vòng bi công nghiệp"	3	vi	3
Máy gia nhiệt cảm ứng SKF TMBH 1	"Máy gia nhiệt cảm ứng di động để lắp vòng bi"	4	vi	4
Dây đai răng Optibelt OMEGA	"Dây đai răng đồng bộ chất lượng cao từ Đức"	5	vi	5
Vòng bi NTN 6308LLU	"Vòng bi cầu chịu tải cao, phớt kép"	6	vi	6
\.


--
-- Data for Name: products_rels; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.products_rels (id, "order", parent_id, path, categories_id) FROM stdin;
1	1	1	categories	1
2	1	2	categories	1
3	1	3	categories	2
4	1	4	categories	3
5	1	5	categories	4
6	1	6	categories	1
\.


--
-- Data for Name: products_specifications; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.products_specifications (_order, _parent_id, id) FROM stdin;
1	1	69830b81789dc04148ca07ec
2	1	69830b81789dc04148ca07ed
3	1	69830b81789dc04148ca07ee
1	2	69830b81789dc04148ca07ef
2	2	69830b81789dc04148ca07f0
3	2	69830b81789dc04148ca07f1
1	3	69830b81789dc04148ca07f2
2	3	69830b81789dc04148ca07f3
1	4	69830b81789dc04148ca07f4
2	4	69830b81789dc04148ca07f5
1	5	69830b81789dc04148ca07f6
2	5	69830b81789dc04148ca07f7
1	6	69830b81789dc04148ca07f8
2	6	69830b81789dc04148ca07f9
3	6	69830b81789dc04148ca07fa
\.


--
-- Data for Name: products_specifications_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.products_specifications_locales (key, value, id, _locale, _parent_id) FROM stdin;
Đường kính trong	25mm	1	vi	69830b81789dc04148ca07ec
Đường kính ngoài	52mm	2	vi	69830b81789dc04148ca07ed
Chiều rộng	15mm	3	vi	69830b81789dc04148ca07ee
Đường kính trong	30mm	4	vi	69830b81789dc04148ca07ef
Đường kính ngoài	62mm	5	vi	69830b81789dc04148ca07f0
Chiều rộng	16mm	6	vi	69830b81789dc04148ca07f1
Dung tích	1kg	7	vi	69830b81789dc04148ca07f2
Nhiệt độ hoạt động	-30°C đến +120°C	8	vi	69830b81789dc04148ca07f3
Công suất	3.6 kVA	9	vi	69830b81789dc04148ca07f4
Trọng lượng tối đa	40kg	10	vi	69830b81789dc04148ca07f5
Loại	HTD 8M	11	vi	69830b81789dc04148ca07f6
Vật liệu	Cao su HNBR	12	vi	69830b81789dc04148ca07f7
Đường kính trong	40mm	13	vi	69830b81789dc04148ca07f8
Đường kính ngoài	90mm	14	vi	69830b81789dc04148ca07f9
Chiều rộng	23mm	15	vi	69830b81789dc04148ca07fa
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.site_settings (id, site_name, logo_id, favicon_id, contact_email, social_facebook, social_zalo, social_youtube, updated_at, created_at) FROM stdin;
1	VIES	\N	\N	info@v-ies.com	https://facebook.com/vies.vietnam	https://zalo.me/0963048317	\N	2026-02-04 09:04:01.757+00	2026-02-04 09:04:01.757+00
\.


--
-- Data for Name: site_settings_contact_phone; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.site_settings_contact_phone (_order, _parent_id, id, number) FROM stdin;
1	1	69830b81789dc04148ca07fb	(+84) 963 048 317
2	1	69830b81789dc04148ca07fc	0903 326 309
3	1	69830b81789dc04148ca07fd	0908 748 304
\.


--
-- Data for Name: site_settings_contact_phone_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.site_settings_contact_phone_locales (label, id, _locale, _parent_id) FROM stdin;
Hotline	1	vi	69830b81789dc04148ca07fb
Mr. Lâm - Báo giá	2	vi	69830b81789dc04148ca07fc
Mr. Hiển - Kỹ thuật	3	vi	69830b81789dc04148ca07fd
\.


--
-- Data for Name: site_settings_locales; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.site_settings_locales (contact_address, id, _locale, _parent_id) FROM stdin;
Số 16, Đường DD3-1, Phường Tân Hưng Thuận, Quận 12, TP. Hồ Chí Minh	1	vi	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.users (id, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) FROM stdin;
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: vies
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
\.


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.brands_id_seq', 8, true);


--
-- Name: brands_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.brands_locales_id_seq', 8, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: categories_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.categories_locales_id_seq', 6, true);


--
-- Name: footer_columns_links_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.footer_columns_links_locales_id_seq', 9, true);


--
-- Name: footer_columns_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.footer_columns_locales_id_seq', 3, true);


--
-- Name: footer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.footer_id_seq', 1, true);


--
-- Name: footer_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.footer_locales_id_seq', 1, true);


--
-- Name: header_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.header_id_seq', 1, true);


--
-- Name: header_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.header_locales_id_seq', 1, true);


--
-- Name: header_navigation_children_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.header_navigation_children_locales_id_seq', 4, true);


--
-- Name: header_navigation_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.header_navigation_locales_id_seq', 5, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.media_id_seq', 1, false);


--
-- Name: media_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.media_locales_id_seq', 1, false);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.news_id_seq', 1, false);


--
-- Name: news_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.news_locales_id_seq', 1, false);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 1, false);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 1, false);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 1, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 1, false);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- Name: products_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.products_locales_id_seq', 6, true);


--
-- Name: products_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.products_rels_id_seq', 6, true);


--
-- Name: products_specifications_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.products_specifications_locales_id_seq', 15, true);


--
-- Name: site_settings_contact_phone_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.site_settings_contact_phone_locales_id_seq', 3, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, true);


--
-- Name: site_settings_locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.site_settings_locales_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vies
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: brands_locales brands_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.brands_locales
    ADD CONSTRAINT brands_locales_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories_locales categories_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories_locales
    ADD CONSTRAINT categories_locales_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: footer_columns_links_locales footer_columns_links_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_links_locales
    ADD CONSTRAINT footer_columns_links_locales_pkey PRIMARY KEY (id);


--
-- Name: footer_columns_links footer_columns_links_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_links
    ADD CONSTRAINT footer_columns_links_pkey PRIMARY KEY (id);


--
-- Name: footer_columns_locales footer_columns_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_locales
    ADD CONSTRAINT footer_columns_locales_pkey PRIMARY KEY (id);


--
-- Name: footer_columns footer_columns_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns
    ADD CONSTRAINT footer_columns_pkey PRIMARY KEY (id);


--
-- Name: footer_locales footer_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_locales
    ADD CONSTRAINT footer_locales_pkey PRIMARY KEY (id);


--
-- Name: footer footer_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer
    ADD CONSTRAINT footer_pkey PRIMARY KEY (id);


--
-- Name: header_locales header_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_locales
    ADD CONSTRAINT header_locales_pkey PRIMARY KEY (id);


--
-- Name: header_navigation_children_locales header_navigation_children_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_children_locales
    ADD CONSTRAINT header_navigation_children_locales_pkey PRIMARY KEY (id);


--
-- Name: header_navigation_children header_navigation_children_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_children
    ADD CONSTRAINT header_navigation_children_pkey PRIMARY KEY (id);


--
-- Name: header_navigation_locales header_navigation_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_locales
    ADD CONSTRAINT header_navigation_locales_pkey PRIMARY KEY (id);


--
-- Name: header_navigation header_navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation
    ADD CONSTRAINT header_navigation_pkey PRIMARY KEY (id);


--
-- Name: header header_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header
    ADD CONSTRAINT header_pkey PRIMARY KEY (id);


--
-- Name: media_locales media_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.media_locales
    ADD CONSTRAINT media_locales_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: news_locales news_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.news_locales
    ADD CONSTRAINT news_locales_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: products_images products_images_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_pkey PRIMARY KEY (id);


--
-- Name: products_locales products_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_locales
    ADD CONSTRAINT products_locales_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products_rels products_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_pkey PRIMARY KEY (id);


--
-- Name: products_specifications_locales products_specifications_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_specifications_locales
    ADD CONSTRAINT products_specifications_locales_pkey PRIMARY KEY (id);


--
-- Name: products_specifications products_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_specifications
    ADD CONSTRAINT products_specifications_pkey PRIMARY KEY (id);


--
-- Name: site_settings_contact_phone_locales site_settings_contact_phone_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_contact_phone_locales
    ADD CONSTRAINT site_settings_contact_phone_locales_pkey PRIMARY KEY (id);


--
-- Name: site_settings_contact_phone site_settings_contact_phone_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_contact_phone
    ADD CONSTRAINT site_settings_contact_phone_pkey PRIMARY KEY (id);


--
-- Name: site_settings_locales site_settings_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_locales
    ADD CONSTRAINT site_settings_locales_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: brands_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX brands_created_at_idx ON public.brands USING btree (created_at);


--
-- Name: brands_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX brands_locales_locale_parent_id_unique ON public.brands_locales USING btree (_locale, _parent_id);


--
-- Name: brands_logo_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX brands_logo_idx ON public.brands USING btree (logo_id);


--
-- Name: brands_slug_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX brands_slug_idx ON public.brands USING btree (slug);


--
-- Name: brands_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX brands_updated_at_idx ON public.brands USING btree (updated_at);


--
-- Name: categories_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX categories_created_at_idx ON public.categories USING btree (created_at);


--
-- Name: categories_image_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX categories_image_idx ON public.categories USING btree (image_id);


--
-- Name: categories_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX categories_locales_locale_parent_id_unique ON public.categories_locales USING btree (_locale, _parent_id);


--
-- Name: categories_parent_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX categories_parent_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX categories_slug_idx ON public.categories USING btree (slug);


--
-- Name: categories_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX categories_updated_at_idx ON public.categories USING btree (updated_at);


--
-- Name: footer_columns_links_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX footer_columns_links_locales_locale_parent_id_unique ON public.footer_columns_links_locales USING btree (_locale, _parent_id);


--
-- Name: footer_columns_links_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX footer_columns_links_order_idx ON public.footer_columns_links USING btree (_order);


--
-- Name: footer_columns_links_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX footer_columns_links_parent_id_idx ON public.footer_columns_links USING btree (_parent_id);


--
-- Name: footer_columns_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX footer_columns_locales_locale_parent_id_unique ON public.footer_columns_locales USING btree (_locale, _parent_id);


--
-- Name: footer_columns_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX footer_columns_order_idx ON public.footer_columns USING btree (_order);


--
-- Name: footer_columns_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX footer_columns_parent_id_idx ON public.footer_columns USING btree (_parent_id);


--
-- Name: footer_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX footer_locales_locale_parent_id_unique ON public.footer_locales USING btree (_locale, _parent_id);


--
-- Name: header_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX header_locales_locale_parent_id_unique ON public.header_locales USING btree (_locale, _parent_id);


--
-- Name: header_navigation_children_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX header_navigation_children_locales_locale_parent_id_unique ON public.header_navigation_children_locales USING btree (_locale, _parent_id);


--
-- Name: header_navigation_children_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX header_navigation_children_order_idx ON public.header_navigation_children USING btree (_order);


--
-- Name: header_navigation_children_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX header_navigation_children_parent_id_idx ON public.header_navigation_children USING btree (_parent_id);


--
-- Name: header_navigation_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX header_navigation_locales_locale_parent_id_unique ON public.header_navigation_locales USING btree (_locale, _parent_id);


--
-- Name: header_navigation_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX header_navigation_order_idx ON public.header_navigation USING btree (_order);


--
-- Name: header_navigation_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX header_navigation_parent_id_idx ON public.header_navigation USING btree (_parent_id);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX media_locales_locale_parent_id_unique ON public.media_locales USING btree (_locale, _parent_id);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: news_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX news_created_at_idx ON public.news USING btree (created_at);


--
-- Name: news_featured_image_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX news_featured_image_idx ON public.news USING btree (featured_image_id);


--
-- Name: news_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX news_locales_locale_parent_id_unique ON public.news_locales USING btree (_locale, _parent_id);


--
-- Name: news_slug_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX news_slug_idx ON public.news USING btree (slug);


--
-- Name: news_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX news_updated_at_idx ON public.news USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_brands_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_brands_id_idx ON public.payload_locked_documents_rels USING btree (brands_id);


--
-- Name: payload_locked_documents_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_categories_id_idx ON public.payload_locked_documents_rels USING btree (categories_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_news_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_news_id_idx ON public.payload_locked_documents_rels USING btree (news_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_products_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_products_id_idx ON public.payload_locked_documents_rels USING btree (products_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: products_brand_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_brand_idx ON public.products USING btree (brand_id);


--
-- Name: products_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_created_at_idx ON public.products USING btree (created_at);


--
-- Name: products_images_image_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_images_image_idx ON public.products_images USING btree (image_id);


--
-- Name: products_images_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_images_order_idx ON public.products_images USING btree (_order);


--
-- Name: products_images_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_images_parent_id_idx ON public.products_images USING btree (_parent_id);


--
-- Name: products_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX products_locales_locale_parent_id_unique ON public.products_locales USING btree (_locale, _parent_id);


--
-- Name: products_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_rels_categories_id_idx ON public.products_rels USING btree (categories_id);


--
-- Name: products_rels_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_rels_order_idx ON public.products_rels USING btree ("order");


--
-- Name: products_rels_parent_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_rels_parent_idx ON public.products_rels USING btree (parent_id);


--
-- Name: products_rels_path_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_rels_path_idx ON public.products_rels USING btree (path);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_specifications_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX products_specifications_locales_locale_parent_id_unique ON public.products_specifications_locales USING btree (_locale, _parent_id);


--
-- Name: products_specifications_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_specifications_order_idx ON public.products_specifications USING btree (_order);


--
-- Name: products_specifications_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_specifications_parent_id_idx ON public.products_specifications USING btree (_parent_id);


--
-- Name: products_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX products_updated_at_idx ON public.products USING btree (updated_at);


--
-- Name: site_settings_contact_phone_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX site_settings_contact_phone_locales_locale_parent_id_unique ON public.site_settings_contact_phone_locales USING btree (_locale, _parent_id);


--
-- Name: site_settings_contact_phone_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX site_settings_contact_phone_order_idx ON public.site_settings_contact_phone USING btree (_order);


--
-- Name: site_settings_contact_phone_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX site_settings_contact_phone_parent_id_idx ON public.site_settings_contact_phone USING btree (_parent_id);


--
-- Name: site_settings_favicon_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX site_settings_favicon_idx ON public.site_settings USING btree (favicon_id);


--
-- Name: site_settings_locales_locale_parent_id_unique; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX site_settings_locales_locale_parent_id_unique ON public.site_settings_locales USING btree (_locale, _parent_id);


--
-- Name: site_settings_logo_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX site_settings_logo_idx ON public.site_settings USING btree (logo_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: vies
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: brands_locales brands_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.brands_locales
    ADD CONSTRAINT brands_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: brands brands_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: categories categories_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: categories_locales categories_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories_locales
    ADD CONSTRAINT categories_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_categories_id_fk FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: footer_columns_links_locales footer_columns_links_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_links_locales
    ADD CONSTRAINT footer_columns_links_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer_columns_links(id) ON DELETE CASCADE;


--
-- Name: footer_columns_links footer_columns_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_links
    ADD CONSTRAINT footer_columns_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer_columns(id) ON DELETE CASCADE;


--
-- Name: footer_columns_locales footer_columns_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns_locales
    ADD CONSTRAINT footer_columns_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer_columns(id) ON DELETE CASCADE;


--
-- Name: footer_columns footer_columns_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_columns
    ADD CONSTRAINT footer_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer(id) ON DELETE CASCADE;


--
-- Name: footer_locales footer_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.footer_locales
    ADD CONSTRAINT footer_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer(id) ON DELETE CASCADE;


--
-- Name: header_locales header_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_locales
    ADD CONSTRAINT header_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header(id) ON DELETE CASCADE;


--
-- Name: header_navigation_children_locales header_navigation_children_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_children_locales
    ADD CONSTRAINT header_navigation_children_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header_navigation_children(id) ON DELETE CASCADE;


--
-- Name: header_navigation_children header_navigation_children_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_children
    ADD CONSTRAINT header_navigation_children_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header_navigation(id) ON DELETE CASCADE;


--
-- Name: header_navigation_locales header_navigation_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation_locales
    ADD CONSTRAINT header_navigation_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header_navigation(id) ON DELETE CASCADE;


--
-- Name: header_navigation header_navigation_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.header_navigation
    ADD CONSTRAINT header_navigation_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header(id) ON DELETE CASCADE;


--
-- Name: media_locales media_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.media_locales
    ADD CONSTRAINT media_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: news news_featured_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_featured_image_id_media_id_fk FOREIGN KEY (featured_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: news_locales news_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.news_locales
    ADD CONSTRAINT news_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_brands_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_brands_fk FOREIGN KEY (brands_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_news_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_news_fk FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_brand_id_brands_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_brands_id_fk FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: products_images products_images_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: products_images products_images_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_locales products_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_locales
    ADD CONSTRAINT products_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_specifications_locales products_specifications_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_specifications_locales
    ADD CONSTRAINT products_specifications_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products_specifications(id) ON DELETE CASCADE;


--
-- Name: products_specifications products_specifications_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.products_specifications
    ADD CONSTRAINT products_specifications_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: site_settings_contact_phone_locales site_settings_contact_phone_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_contact_phone_locales
    ADD CONSTRAINT site_settings_contact_phone_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_settings_contact_phone(id) ON DELETE CASCADE;


--
-- Name: site_settings_contact_phone site_settings_contact_phone_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_contact_phone
    ADD CONSTRAINT site_settings_contact_phone_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_settings(id) ON DELETE CASCADE;


--
-- Name: site_settings site_settings_favicon_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_favicon_id_media_id_fk FOREIGN KEY (favicon_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: site_settings_locales site_settings_locales_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings_locales
    ADD CONSTRAINT site_settings_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_settings(id) ON DELETE CASCADE;


--
-- Name: site_settings site_settings_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: vies
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 16ojVlj2Dg6CS2SfHO1bUEVchsQcyE5WkUwOtM2aLairhktGTdTvFsdzWwXGeQB

