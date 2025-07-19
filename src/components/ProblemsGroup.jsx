// HomePage/ProblemsGroup.jsx
import React from "react";
import ChevronIcon from "./ChevronIcon";
import ProblemsTable from "./ProblemsTable";

export default function ProblemsGroup({
  groupedProblems,
  openTags,
  openSubTags,
  openDifficulties,
  handleRootTagToggle,
  toggleSubTag,
  toggleDifficulty,
  selectedTopic,
  isPremiumUser,
  solved,
  toggleSolved
}) {
  return Object.keys(groupedProblems)
    .sort()
    .map((rootTag) => (
      <div key={rootTag} className="root-tag-section">
        {rootTag === selectedTopic && (
          <>
            <div
              className="collapsible-header root-tag-collapsible"
              onClick={() => handleRootTagToggle(rootTag)}
              style={{
                cursor: 'pointer',
                fontSize: '1.22em',
                fontWeight: 600,
                marginTop: 18,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <ChevronIcon open={!!openTags[rootTag]} />
              {rootTag}
            </div>
            {openTags[rootTag] && (
              <div style={{ marginLeft: '1.2em' }}>
                {Object.keys(groupedProblems[rootTag])
                  .sort()
                  .map((subTag) => {
                    const subKey = `${rootTag}//${subTag}`;
                    return (
                      <div key={subTag} className="subtag-section">
                        <div
                          className="collapsible-header subtag-collapsible"
                          onClick={() => toggleSubTag(rootTag, subTag)}
                          style={{
                            cursor: 'pointer',
                            fontWeight: 500,
                            marginTop: 8,
                            marginBottom: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          <ChevronIcon open={!!openSubTags[subKey]} size={15} />
                          {subTag}
                        </div>
                        {openSubTags[subKey] && (
                          <div style={{ marginLeft: '1.2em' }}>
                            {Object.keys(groupedProblems[rootTag][subTag])
                              .sort()
                              .map((difficulty) => {
                                const difficultyKey = `${rootTag}//${subTag}//${difficulty}`;
                                const problemsInSection = groupedProblems[rootTag][subTag][difficulty];
                                return (
                                  <div key={difficulty} className="difficulty-section">
                                    <div
                                      className="collapsible-header difficulty-collapsible"
                                      onClick={() => toggleDifficulty(rootTag, subTag, difficulty)}
                                      style={{
                                        fontWeight: 400,
                                        margin: '10px 0 3px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5
                                      }}
                                    >
                                      <ChevronIcon open={!!openDifficulties[difficultyKey]} size={13} />
                                      {difficulty}
                                    </div>
                                    {openDifficulties[difficultyKey] && (
                                      <ProblemsTable
                                        problems={problemsInSection}
                                        isPremiumUser={isPremiumUser}
                                        solved={solved}
                                        toggleSolved={toggleSolved}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    ));
}
