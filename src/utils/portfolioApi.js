/**
 * Utility to fetch coding platform statistics
 */

const LEETCODE_STATS_API = "https://leetcode-stats-api.herokuapp.com";

/**
 * Fetch LeetCode statistics for a given username
 * @param {string} username 
 * @returns {Promise<Object|null>}
 */
export const fetchLeetCodeStats = async (username) => {
    if (!username) return null;
    try {
        const response = await fetch(`${LEETCODE_STATS_API}/${username}`);
        const data = await response.json();

        if (data.status === "error") {
            throw new Error(data.message || "Failed to fetch stats");
        }

        return {
            status: "success",
            totalSolved: data.totalSolved,
            totalQuestions: data.totalQuestions,
            easySolved: data.easySolved,
            mediumSolved: data.mediumSolved,
            hardSolved: data.hardSolved,
            acceptanceRate: data.acceptanceRate,
            ranking: data.ranking,
            contributionPoints: data.contributionPoints,
            reputation: data.reputation,
            submissionCalendar: data.submissionCalendar,
        };
    } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
        return { status: "error", message: error.message };
    }
};

/**
 * Get other platforms profile URLs
 */
export const getPlatformUrls = (handles) => {
    const { leetcode, github, codeforces, codolio } = handles || {};
    return {
        leetcode: leetcode ? `https://leetcode.com/${leetcode}` : null,
        github: github ? `https://github.com/${github}` : null,
        codeforces: codeforces ? `https://codeforces.com/profile/${codeforces}` : null,
        codolio: codolio ? `https://codolio.com/profile/${codolio}` : null,
    };
};
