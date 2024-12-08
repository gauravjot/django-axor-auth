type Doc = { id: string; slug: string; body: string; data: { title: string; sort?: number;  alias?: string} };

export type TreeNode = {
  name: string;
  title: string;
  slug: string;
  children: TreeNode[];
  path?: string;
  sort?: number;
  is_empty: boolean;
};

export function buildTree(docs: Doc[]): TreeNode[] {
  const root: TreeNode[] = [];

  // change flat list of files into a tree structure
  // slug is like abc/def.md; abc/ddd.md; abc/index.md; index.md; asb.md

  for (const doc of docs) {
    const parts = doc.slug.split('/');
    let parent = root;
    let path = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      path += i === 0 ? part : `/${part}`;
      let node = parent.find((n) => n.name === part);

      if (!node) {
        node = {
          name: part,
          title: part,
          slug: path,
          children: [],
          is_empty: false,
        };
        parent.push(node);
      }

      if (i === parts.length - 1) {
        node.title = doc.data.alias ?? doc.data.title;
        node.path = doc.slug;
        node.sort = doc.data.sort;
        node.is_empty = doc.body.length === 0;
      }

      parent = node.children;
    }
  }

  function sortTree(tree: TreeNode[]): TreeNode[] {
    return tree
      .map((node) => ({
        ...node,
        children: sortTree(node.children),
      }))
      .sort((a, b) => {
        if (a.sort && b.sort) {
          return a.sort - b.sort;
        }

        if (a.sort) {
          return -1;
        }

        if (b.sort) {
          return 1;
        }

        return a.name.localeCompare(b.name);
      });
  }

  const t = sortTree(root);
  return t;
}