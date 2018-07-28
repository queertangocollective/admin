import RenderMobiledoc from '../render-mobiledoc';
import { computed } from '@ember/object';
import * as TagNameUtils from 'ember-mobiledoc-dom-renderer/mobiledoc-dom-renderer/utils/tag-names';

let isValidSectionTagName = TagNameUtils.isValidSectionTagName;
TagNameUtils.isValidSectionTagName = function (tagName, sectionType) {
  if (tagName === 'small') {
    return true;
  }
  return isValidSectionTagName(tagName, sectionType);
};

export default RenderMobiledoc.extend({
  cardNameToComponentName(name) {
    return 'post-cards/' + name;
  },
  sectionElementRenderer: computed(function () {
    return {
      small(tagName, dom) {
        let element = dom.createElement(tagName);
        return element;
      }
    };
  })
})