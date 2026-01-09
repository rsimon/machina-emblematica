import { visit } from 'unist-util-visit';

export const ImageMarkerPlugin = () => {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'textDirective' && node.name === 'image') {
        const id = node.attributes?.id || node.children?.[0]?.value;

        node.data = node.data || {};
        node.data.hName = 'image-marker';
        node.data.hProperties = { id };
      }
    });
  };
}