import { isHighestPriority } from "../../../src/utils/priorities";

describe("priorities", () => {
  describe("#isHighestPriority()", () => {
    it("should correctly report a highlighter has the highest priority value", () => {
      const highlighterNamespace = "findHighlights";
      const priorities = {
        someHighlights: 1,
        findHighlights: 3,
        userHighlights: 2,
      };
      const result = isHighestPriority(highlighterNamespace, priorities);
      expect(result).toBeTrue();
    });

    it("should correctly report a highlighter has priority when it has the equal highest priority value", () => {
      const highlighterNamespace = "findHighlights1";
      const priorities = {
        findHighlights1: 24,
        findHighlights2: 15,
        userHighlights: 24,
        markerHighlights: 19,
      };
      const result = isHighestPriority(highlighterNamespace, priorities);
      expect(result).toBeTrue();
    });

    it("should correctly report a highlighter has priority when it does not have the highest priority value", () => {
      const highlighterNamespace = "userHighlights1";
      const priorities = {
        findHighlights1: 24,
        findHighlights2: 15,
        userHighlights1: 14,
        userHighlights2: 4,
        markerHighlights: 19,
      };
      const result = isHighestPriority(highlighterNamespace, priorities);
      expect(result).toBeFalse();
    });

    it("should correctly report a highlighter has priority when no priorities are set", () => {
      const highlighterNamespace = "userHighlights";
      const priorities = {};
      const result = isHighestPriority(highlighterNamespace, priorities);
      expect(result).toBeTrue();
    });

    it("should correctly report a highlighter does not have priority if it has not been assigned one", () => {
      const highlighterNamespace = "otherHighlights";
      const priorities = {
        findHighlights1: 24,
        findHighlights2: 15,
        userHighlights1: 14,
        userHighlights2: 4,
        markerHighlights: 19,
      };
      const result = isHighestPriority(highlighterNamespace, priorities);
      expect(result).toBeFalse();
    });
  });
});
