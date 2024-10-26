const someObj = {
  18: {
    id: 18,
    parentId: 30,
  },
  30: {
    id: 30,
    parentId: 44,
  },
  44: {
    id: 44,
    parentId: null,
  },
};

const checkIfUpdatedIdMatches = (currentPageId, updatedPageId) => {
  let currentPage = someObj[currentPageId];

  // Loop through parent chain
  while (currentPage) {
    // If the id matches the updatedPageId, return true
    if (currentPage.id === updatedPageId) {
      return true;
    }

    // Move to the parent, if parentId exists
    if (currentPage.parentId) {
      currentPage = someObj[currentPage.parentId];
    } else {
      break; // No more parents to check
    }
  }

  // If no match found, return false
  return false;
};

// Example usage:
const currentPageId = 18;
const updatedPageId = 44;

const result = checkIfUpdatedIdMatches(currentPageId, updatedPageId);
console.log(result); // Output: true
