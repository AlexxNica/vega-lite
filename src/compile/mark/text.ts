import {X, Y, TEXT, SIZE} from '../../channel';
import {applyConfig, numberFormat, timeFormatExpression} from '../common';

import {applyColorAndOpacity} from './common';
import {Config} from '../../config';
import {ChannelDef, TextFieldDef, ValueDef, field, isFieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {UnitModel} from '../unit';
import {VgValueRef, VgEncodeEntry} from '../../vega.schema';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const text: MarkCompiler = {
  vgMark: 'text',
  role: undefined,

  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};

    applyConfig(e, model.config().text,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);

    const config = model.config();
    const stack = model.stack();
    const textDef = model.encoding().text;

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    e.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, xDefault(config, textDef));
    e.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

    e.fontSize = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
       {value: config.text.fontSize}
    );

    e.text = textRef(textDef, config);

    applyColorAndOpacity(e, model);

    return e;
  }
};

function xDefault(config: Config, textDef: ChannelDef): VgValueRef {
  if (isFieldDef(textDef) && textDef.type === QUANTITATIVE) {
    return {field: {group: 'width'}, offset: -5};
  }
  // TODO: allow this to fit (Be consistent with ref.midX())
  return {value: config.scale.textXRangeStep / 2};
}

function textRef(textDef: TextFieldDef | ValueDef<any>, config: Config): VgValueRef {
  // text
  if (textDef) {
    if (isFieldDef(textDef)) {
      if (QUANTITATIVE === textDef.type) {
        // FIXME: what happens if we have bin?
        const format = numberFormat(textDef, textDef.format, config, TEXT);
        return {
          signal: `format(${field(textDef, {datum: true})}, '${format}')`
        };
      } else if (TEMPORAL === textDef.type) {
        return {
          signal: timeFormatExpression(field(textDef, {datum: true}), textDef.timeUnit, textDef.format, config.text.shortTimeLabels, config)
        };
      } else {
        return {field: textDef.field};
      }
    } else if (textDef.value) {
      return {value: textDef.value};
    }
  }
  return {value: config.text.text};
}
