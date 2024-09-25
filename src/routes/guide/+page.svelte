<script lang="ts">
    import fs from 'fs'; 
    import Markdoc from '@markdoc/markdoc';
    import intro from './intro.md?raw';

    const parsed = Markdoc.parse(intro);
    const content = Markdoc.transform(parsed /* config */);      //config stage possible
    let html = Markdoc.renderers.html(content);
</script>

{@html html}
