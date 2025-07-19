import React, { useState, useEffect } from 'react';
import Logo from './Logo';

import Sidebar from './Sidebar';
import PremiumFeature from './PremiumFeature';
import ProgressBar from './ProgressBar';
import FiltersBar from './FiltersBar';
import ProblemsGroup from './ProblemsGroup';

import {
  groupProblems,
  sortGroupedProblems,
  getTopics,
  getUniqueCompanies,
  searchAndFilterProblems
} from '../utils/problemUtils';

import './HomePage.css';

const SOLVED_STORAGE_KEY = "leetcode_solved_problems";

export default function HomePage({ problems, userEmail }) {
  // Premium toggle, progress state, etc. unchanged...
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const storageKey = `${SOLVED_STORAGE_KEY}_${userEmail}`;
  const [solved, setSolved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(solved));
  }, [solved, storageKey]);
  const toggleSolved = (number) => {
    setSolved(prev => ({
      ...prev,
      [number]: !prev[number]
    }));
  };

  const [filters, setFilters] = useState({
    number: '',
    title: '',
    tag: '',
    frequency: '',
    companies: '',
    difficulty: '',
  });
  const [search, setSearch] = useState('');

  // Topics
  const allTopics = getTopics(problems);
  const [selectedTopic, setSelectedTopic] = useState(allTopics[0]);
  const [openTags, setOpenTags] = useState({});
  const [openSubTags, setOpenSubTags] = useState({});
  const [openDifficulties, setOpenDifficulties] = useState({});
  useEffect(() => {
    setOpenTags(prev => ({
      ...prev,
      [selectedTopic]: true
    }));
  }, [selectedTopic]);

  const fuseOptions = {
    keys: ['number', 'title', 'tag', 'frequency', 'companies', 'difficulty'],
    threshold: 0.3,
  };

  // Filter and search logic
  const problemsForTopic = problems.filter(p =>
    (p.tag ? p.tag.split('/')[0].trim() : "Other") === selectedTopic
  );
  const searchResults = searchAndFilterProblems({
    problems: problemsForTopic,
    filters,
    search,
    fuseOptions,
  });

  // Group/sort
  let groupedProblems = groupProblems(searchResults);
  groupedProblems = sortGroupedProblems(groupedProblems);

  const uniqueCompanies = getUniqueCompanies(problems);

  // Collapsible logic unchanged
  function handleRootTagToggle(rootTag) {
    setOpenTags(prevOpenTags => {
      const currentlyOpen = !!prevOpenTags[rootTag];
      if (!currentlyOpen) {
        const subTags = Object.keys(groupedProblems[rootTag] || {});
        const newOpenSubTags = { ...openSubTags };
        const newOpenDifficulties = { ...openDifficulties };
        subTags.forEach(subTag => {
          const subKey = `${rootTag}//${subTag}`;
          newOpenSubTags[subKey] = true;
          const difficulties = Object.keys(groupedProblems[rootTag][subTag] || {});
          difficulties.forEach(diff => {
            const diffKey = `${rootTag}//${subTag}//${diff}`;
            newOpenDifficulties[diffKey] = true;
          });
        });
        setOpenSubTags(newOpenSubTags);
        setOpenDifficulties(newOpenDifficulties);
      }
      return { ...prevOpenTags, [rootTag]: !currentlyOpen };
    });
  }
  const toggleSubTag = (rootTag, subTag) => {
    const key = `${rootTag}//${subTag}`;
    setOpenSubTags(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const toggleDifficulty = (rootTag, subTag, difficulty) => {
    const key = `${rootTag}//${subTag}//${difficulty}`;
    setOpenDifficulties(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Progress calc
  const topicTotal = problemsForTopic.length;
  const topicSolved = problemsForTopic.filter(p => solved[p.number]).length;

  return (
    <div className="page-row">
      <Sidebar
        topics={allTopics}
        selected={selectedTopic}
        onSelect={setSelectedTopic}
      />
      <div className="home-container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button
            className={`toggle-premium-btn ${isPremiumUser ? "premium" : ""}`}
            onClick={() => setIsPremiumUser(v => !v)}
          >
            {isPremiumUser ? "Switch to Free" : "Switch to Premium"}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em', marginBottom: 8 }}>
          <Logo style={{ maxWidth: 220, height: 56 }} />
        </div>
        <p style={{ marginTop: 0, color: '#64748b', fontSize: '1.18em' }}>
          Explore problems, learn solutions, and enhance your skills.
        </p>
        <PremiumFeature isPremiumUser={isPremiumUser}>
          <div className="premium-content" style={{ margin: "18px 0" }}>
            <h3>🔥 Premium Video Solution</h3>
            <iframe
              width="100%"
              height="240"
              src="https://www.youtube.com/embed/2pTmO6vR3wA"
              title="Premium Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </PremiumFeature>
        <ProgressBar solvedCount={topicSolved} totalCount={topicTotal} />
        <FiltersBar
          filters={filters}
          setFilters={setFilters}
          uniqueCompanies={uniqueCompanies}
          search={search}
          setSearch={setSearch}
          problems={problems}
        />
        <div style={{ margin: "16px 0", fontWeight: 500 }}>
          Showing <span style={{ color: "#2563eb" }}>{searchResults.length}</span> problem{searchResults.length !== 1 ? "s" : ""}.{' '}
          <span style={{ marginLeft: 16, color: "#16a34a" }}>
            <b>Solved:</b> {topicSolved}
          </span>
        </div>
        <ProblemsGroup
          groupedProblems={groupedProblems}
          openTags={openTags}
          openSubTags={openSubTags}
          openDifficulties={openDifficulties}
          handleRootTagToggle={handleRootTagToggle}
          toggleSubTag={toggleSubTag}
          toggleDifficulty={toggleDifficulty}
          selectedTopic={selectedTopic}
          isPremiumUser={isPremiumUser}
          solved={solved}
          toggleSolved={toggleSolved}
        />
      </div>
    </div>
  );
}
