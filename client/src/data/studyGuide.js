// Study Hub data — split per category (see ./studyTopics/) so no single file
// balloons to thousands of lines. This barrel file re-exports the same
// STUDY_CATEGORIES / STUDY_TOPICS shape as before, so nothing importing from
// "../data/studyGuide" needs to change.
import { STUDY_CATEGORIES } from "./studyCategories";

import html from "./studyTopics/html";
import css from "./studyTopics/css";
import javascript from "./studyTopics/javascript";
import typescript from "./studyTopics/typescript";
import react from "./studyTopics/react";
import reactnative from "./studyTopics/reactnative";
import nextjs from "./studyTopics/nextjs";
import git from "./studyTopics/git";
import python from "./studyTopics/python";
import pybackend from "./studyTopics/pybackend";
import pyai from "./studyTopics/pyai";
import pydata from "./studyTopics/pydata";
import nodejs from "./studyTopics/nodejs";
import browserinternals from "./studyTopics/browserinternals";
import networking from "./studyTopics/networking";
import websecurity from "./studyTopics/websecurity";
import performance from "./studyTopics/performance";
import buildtools from "./studyTopics/buildtools";
import softwarearchitecture from "./studyTopics/softwarearchitecture";
import designpatterns from "./studyTopics/designpatterns";
import frontendsystemdesign from "./studyTopics/frontendsystemdesign";
import testing from "./studyTopics/testing";
import database from "./studyTopics/database";
import backend from "./studyTopics/backend";
import devops from "./studyTopics/devops";
import aifordevs from "./studyTopics/aifordevs";
import accessibility from "./studyTopics/accessibility";
import seo from "./studyTopics/seo";
import pwa from "./studyTopics/pwa";
import csfundamentals from "./studyTopics/csfundamentals";

export { STUDY_CATEGORIES };

export const STUDY_TOPICS = [
  ...html,
  ...css,
  ...javascript,
  ...typescript,
  ...react,
  ...reactnative,
  ...nextjs,
  ...git,
  ...python,
  ...pybackend,
  ...pyai,
  ...pydata,
  ...nodejs,
  ...browserinternals,
  ...networking,
  ...websecurity,
  ...performance,
  ...buildtools,
  ...softwarearchitecture,
  ...designpatterns,
  ...frontendsystemdesign,
  ...testing,
  ...database,
  ...backend,
  ...devops,
  ...aifordevs,
  ...accessibility,
  ...seo,
  ...pwa,
  ...csfundamentals,
];
