const RENDER_TYPE = 'dom';
const DEFAULT_KOENIG_OPTIONS = {
  hasEditMode: true,
  selectAfterInsert: true
};

function renderFallback(doc) {
  let element = doc.createElement('div');
  let text = doc.createTextNode('[placeholder for Ember component card]');
  element.appendChild(text);
  return element;
}

// sets up boilerplate for an Ember component card
export default function createComponentCard(name, koenigOptions, doc = window.document) {
  return {
      name,
      type: RENDER_TYPE,

      // Called when the card is added to a mobiledoc document.
      // The `cardArg.options` object contains the methods that were set up
      // on the `cardOptions` property of the editor in `{{koenig-editor}}`,
      // by calling those hooks we set up everything needed for rendering
      // ember components as cards
      render(cardArg) {
          let {env, options} = cardArg;
          let kgOptions = Object.assign({}, DEFAULT_KOENIG_OPTIONS, koenigOptions);

          if (!options.addComponent) {
              return renderFallback(doc);
          }

          let {card, element} = options.addComponent(cardArg, kgOptions);
          let {onTeardown} = env;

          onTeardown(() => options.removeComponent(card));

          return element;
      }
  };
}
