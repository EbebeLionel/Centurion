export interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
  parent?: CategoryNode;
  level: number;
}

export interface CategoryTree {
  root: CategoryNode[];
  searchIndex: Map<string, CategoryNode[]>;
}

// Create the hierarchical category tree
export const createCategoryTree = (): CategoryTree => {
  const tree: CategoryTree = {
    root: [],
    searchIndex: new Map()
  };

  // Helper function to create a node
  const createNode = (id: string, name: string, level: number, parent?: CategoryNode): CategoryNode => {
    const node: CategoryNode = {
      id,
      name,
      children: [],
      parent,
      level
    };
    
    // Add to search index (case-insensitive)
    const searchKey = name.toLowerCase();
    if (!tree.searchIndex.has(searchKey)) {
      tree.searchIndex.set(searchKey, []);
    }
    tree.searchIndex.get(searchKey)?.push(node);
    
    return node;
  };

  // Helper function to add child to parent
  const addChild = (parent: CategoryNode, child: CategoryNode): void => {
    child.parent = parent;
    parent.children.push(child);
  };

  // Build the category tree structure
  
  // 1. CHARACTER branch
  const character = createNode('character', 'Character', 0);
  const humanoid = createNode('humanoid', 'Humanoid', 1, character);
  const fantasy = createNode('fantasy', 'Fantasy', 1, character);
  const scifi = createNode('scifi', 'Sci-Fi', 1, character);
  
  addChild(character, humanoid);
  addChild(character, fantasy);
  addChild(character, scifi);
  
  // Humanoid subcategories
  addChild(humanoid, createNode('warrior', 'Warrior', 2, humanoid));
  addChild(humanoid, createNode('mage', 'Mage', 2, humanoid));
  addChild(humanoid, createNode('rogue', 'Rogue', 2, humanoid));
  
  // Fantasy subcategories
  addChild(fantasy, createNode('dragon', 'Dragon', 2, fantasy));
  addChild(fantasy, createNode('elf', 'Elf', 2, fantasy));
  addChild(fantasy, createNode('dwarf', 'Dwarf', 2, fantasy));
  
  // Sci-Fi subcategories
  addChild(scifi, createNode('alien', 'Alien', 2, scifi));
  addChild(scifi, createNode('cyborg', 'Cyborg', 2, scifi));
  addChild(scifi, createNode('android', 'Android', 2, scifi));

  // 2. MACHINERY branch
  const machinery = createNode('machinery', 'Machinery', 0);
  const vehicle = createNode('vehicle', 'Vehicle', 1, machinery);
  const robots = createNode('robots', 'Robots', 1, machinery);
  const industrial = createNode('industrial', 'Industrial', 1, machinery);
  
  addChild(machinery, vehicle);
  addChild(machinery, robots);
  addChild(machinery, industrial);
  
  // Vehicle subcategories
  addChild(vehicle, createNode('car', 'Car', 2, vehicle));
  addChild(vehicle, createNode('helicopter', 'Helicopter', 2, vehicle));
  addChild(vehicle, createNode('plane', 'Plane', 2, vehicle));
  addChild(vehicle, createNode('bike', 'Bike', 2, vehicle));
  addChild(vehicle, createNode('train', 'Train', 2, vehicle));
  addChild(vehicle, createNode('tank', 'Tank', 2, vehicle));
  addChild(vehicle, createNode('submarine', 'Submarine', 2, vehicle));
  
  // Robot subcategories
  addChild(robots, createNode('optimus-prime', 'Optimus Prime', 2, robots));
  addChild(robots, createNode('gundam', 'Gundam', 2, robots));
  addChild(robots, createNode('mech', 'Mech', 2, robots));
  addChild(robots, createNode('drone', 'Drone', 2, robots));
  
  // Industrial subcategories
  addChild(industrial, createNode('crane', 'Crane', 2, industrial));
  addChild(industrial, createNode('excavator', 'Excavator', 2, industrial));
  addChild(industrial, createNode('generator', 'Generator', 2, industrial));

  // 3. ARCHITECTURE branch
  const architecture = createNode('architecture', 'Architecture', 0);
  const building = createNode('building', 'Building', 1, architecture);
  const structure = createNode('structure', 'Structure', 1, architecture);
  const environment = createNode('environment', 'Environment', 1, architecture);
  
  addChild(architecture, building);
  addChild(architecture, structure);
  addChild(architecture, environment);
  
  // Building subcategories
  addChild(building, createNode('house', 'House', 2, building));
  addChild(building, createNode('castle', 'Castle', 2, building));
  addChild(building, createNode('skyscraper', 'Skyscraper', 2, building));
  addChild(building, createNode('temple', 'Temple', 2, building));
  
  // Structure subcategories
  addChild(structure, createNode('bridge', 'Bridge', 2, structure));
  addChild(structure, createNode('tower', 'Tower', 2, structure));
  addChild(structure, createNode('wall', 'Wall', 2, structure));
  
  // Environment subcategories
  addChild(environment, createNode('landscape', 'Landscape', 2, environment));
  addChild(environment, createNode('city', 'City', 2, environment));
  addChild(environment, createNode('dungeon', 'Dungeon', 2, environment));

  // 4. WEAPONS branch
  const weapons = createNode('weapons', 'Weapons', 0);
  const melee = createNode('melee', 'Melee', 1, weapons);
  const ranged = createNode('ranged', 'Ranged', 1, weapons);
  const magical = createNode('magical', 'Magical', 1, weapons);
  
  addChild(weapons, melee);
  addChild(weapons, ranged);
  addChild(weapons, magical);
  
  // Melee subcategories
  addChild(melee, createNode('sword', 'Sword', 2, melee));
  addChild(melee, createNode('axe', 'Axe', 2, melee));
  addChild(melee, createNode('spear', 'Spear', 2, melee));
  addChild(melee, createNode('dagger', 'Dagger', 2, melee));
  
  // Ranged subcategories
  addChild(ranged, createNode('bow', 'Bow', 2, ranged));
  addChild(ranged, createNode('gun', 'Gun', 2, ranged));
  addChild(ranged, createNode('rifle', 'Rifle', 2, ranged));
  addChild(ranged, createNode('crossbow', 'Crossbow', 2, ranged));
  
  // Magical subcategories
  addChild(magical, createNode('staff', 'Staff', 2, magical));
  addChild(magical, createNode('wand', 'Wand', 2, magical));
  addChild(magical, createNode('orb', 'Orb', 2, magical));

  // 5. ANIMAL branch
  const animal = createNode('animal', 'Animal', 0);
  const mammal = createNode('mammal', 'Mammal', 1, animal);
  const bird = createNode('bird', 'Bird', 1, animal);
  const reptile = createNode('reptile', 'Reptile', 1, animal);
  const sea = createNode('sea', 'Sea Creature', 1, animal);
  
  addChild(animal, mammal);
  addChild(animal, bird);
  addChild(animal, reptile);
  addChild(animal, sea);
  
  // Mammal subcategories
  addChild(mammal, createNode('dog', 'Dog', 2, mammal));
  addChild(mammal, createNode('cat', 'Cat', 2, mammal));
  addChild(mammal, createNode('horse', 'Horse', 2, mammal));
  addChild(mammal, createNode('wolf', 'Wolf', 2, mammal));
  addChild(mammal, createNode('bear', 'Bear', 2, mammal));
  
  // Bird subcategories
  addChild(bird, createNode('eagle', 'Eagle', 2, bird));
  addChild(bird, createNode('owl', 'Owl', 2, bird));
  addChild(bird, createNode('phoenix', 'Phoenix', 2, bird));
  
  // Reptile subcategories
  addChild(reptile, createNode('snake', 'Snake', 2, reptile));
  addChild(reptile, createNode('lizard', 'Lizard', 2, reptile));
  addChild(reptile, createNode('turtle', 'Turtle', 2, reptile));
  
  // Sea creature subcategories
  addChild(sea, createNode('fish', 'Fish', 2, sea));
  addChild(sea, createNode('shark', 'Shark', 2, sea));
  addChild(sea, createNode('whale', 'Whale', 2, sea));

  // 6. MONSTER branch
  const monster = createNode('monster', 'Monster', 0);
  const demon = createNode('demon', 'Demon', 1, monster);
  const undead = createNode('undead', 'Undead', 1, monster);
  const beast = createNode('beast', 'Beast', 1, monster);
  
  addChild(monster, demon);
  addChild(monster, undead);
  addChild(monster, beast);
  
  // Demon subcategories
  addChild(demon, createNode('imp', 'Imp', 2, demon));
  addChild(demon, createNode('succubus', 'Succubus', 2, demon));
  addChild(demon, createNode('balrog', 'Balrog', 2, demon));
  
  // Undead subcategories
  addChild(undead, createNode('skeleton', 'Skeleton', 2, undead));
  addChild(undead, createNode('zombie', 'Zombie', 2, undead));
  addChild(undead, createNode('vampire', 'Vampire', 2, undead));
  addChild(undead, createNode('lich', 'Lich', 2, undead));
  
  // Beast subcategories
  addChild(beast, createNode('minotaur', 'Minotaur', 2, beast));
  addChild(beast, createNode('centaur', 'Centaur', 2, beast));
  addChild(beast, createNode('griffon', 'Griffon', 2, beast));

  // 7. BOSS branch
  const boss = createNode('boss', 'Boss', 0);
  const raid = createNode('raid', 'Raid Boss', 1, boss);
  const final = createNode('final', 'Final Boss', 1, boss);
  const mini = createNode('mini', 'Mini Boss', 1, boss);
  
  addChild(boss, raid);
  addChild(boss, final);
  addChild(boss, mini);
  
  // Boss subcategories
  addChild(raid, createNode('dragon-king', 'Dragon King', 2, raid));
  addChild(raid, createNode('titan', 'Titan', 2, raid));
  addChild(final, createNode('dark-lord', 'Dark Lord', 2, final));
  addChild(final, createNode('god', 'God', 2, final));
  addChild(mini, createNode('guardian', 'Guardian', 2, mini));
  addChild(mini, createNode('champion', 'Champion', 2, mini));

  // Add main categories to root
  tree.root.push(character, machinery, architecture, weapons, animal, monster, boss);
  
  return tree;
};

// Singleton instance
export const categoryTree = createCategoryTree();

// Search functions
export const searchByCategory = (searchTerm: string): CategoryNode[] => {
  const searchKey = searchTerm.toLowerCase().trim();
  return categoryTree.searchIndex.get(searchKey) || [];
};

export const findAllDescendants = (node: CategoryNode): CategoryNode[] => {
  const descendants: CategoryNode[] = [node];
  
  for (const child of node.children) {
    descendants.push(...findAllDescendants(child));
  }
  
  return descendants;
};

export const findNodeByPath = (path: string[]): CategoryNode | null => {
  if (path.length === 0) return null;
  
  let current = categoryTree.root.find(node => 
    node.name.toLowerCase() === path[0].toLowerCase()
  );
  
  if (!current) return null;
  
  for (let i = 1; i < path.length; i++) {
    current = current.children.find(child => 
      child.name.toLowerCase() === path[i].toLowerCase()
    );
    if (!current) return null;
  }
  
  return current;
};

export const getNodePath = (node: CategoryNode): string[] => {
  const path: string[] = [];
  let current: CategoryNode | undefined = node;
  
  while (current) {
    path.unshift(current.name);
    current = current.parent;
  }
  
  return path;
};

// Get all category names for search suggestions (returns lowercase keys)
export const getAllCategoryNames = (): string[] => {
  return Array.from(categoryTree.searchIndex.keys());
};

// Get all category names with proper capitalization for display
export const getAllCategoryNamesForDisplay = (): string[] => {
  const allCategories: string[] = [];
  
  const collectCategories = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      allCategories.push(node.name);
      collectCategories(node.children);
    }
  };
  
  collectCategories(categoryTree.root);
  return allCategories.sort();
};

// Check if a model belongs to a category (including parent categories)
export const isModelInCategory = (modelCategories: string[], searchCategory: string): boolean => {
  const searchNodes = searchByCategory(searchCategory);
  
  for (const searchNode of searchNodes) {
    const descendants = findAllDescendants(searchNode);
    const descendantNames = descendants.map(d => d.name.toLowerCase());
    
    // Check if any of the model's categories match this category or its descendants
    const hasMatch = modelCategories.some(modelCategory =>
      descendantNames.includes(modelCategory.toLowerCase()) ||
      modelCategory.toLowerCase() === searchCategory.toLowerCase()
    );
    
    if (hasMatch) return true;
  }
  
  // Also check for exact match (case-insensitive)
  const exactMatch = modelCategories.some(modelCategory =>
    modelCategory.toLowerCase() === searchCategory.toLowerCase()
  );
  
  return exactMatch;
};

// Get all flat categories (from all trees) for selection
export const getAllFlatCategories = (): string[] => {
  const allCategories: string[] = [];
  
  const collectCategories = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      allCategories.push(node.name);
      collectCategories(node.children);
    }
  };
  
  collectCategories(categoryTree.root);
  return allCategories.sort();
};

// Get category suggestions based on user input
export const getCategorySuggestions = (input: string, limit: number = 10): string[] => {
  const allCategories = getAllFlatCategories();
  const searchTerm = input.toLowerCase();
  
  return allCategories
    .filter(category => category.toLowerCase().includes(searchTerm))
    .slice(0, limit);
};

// Check if a category exists in any tree
export const categoryExists = (categoryName: string): boolean => {
  const searchKey = categoryName.toLowerCase();
  return categoryTree.searchIndex.has(searchKey);
};

// Get the tree path for a category (for display purposes)
export const getCategoryPath = (categoryName: string): string | null => {
  const nodes = searchByCategory(categoryName);
  if (nodes.length === 0) return null;
  
  const node = nodes[0]; // Take the first match
  const path = getNodePath(node);
  return path.join(' > ');
};

// Enhanced search that supports multiple categories across trees
export const searchModelsAcrossCategories = (modelCategories: string[], searchTerm: string): boolean => {
  const searchLower = searchTerm.toLowerCase().trim();
  
  // Direct category match
  if (modelCategories.some(cat => cat.toLowerCase() === searchLower)) {
    return true;
  }
  
  // Tree-based search
  return isModelInCategory(modelCategories, searchTerm);
};