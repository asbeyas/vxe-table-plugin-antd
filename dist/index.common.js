"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginAntd = void 0;

var _ = _interopRequireWildcard(require("lodash"));

var _xeUtils = _interopRequireDefault(require("xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isEmptyValue(cellValue) {
  return cellValue === null || cellValue === undefined || cellValue === '';
}

function getModelProp(renderOpts) {
  var prop = 'value';

  switch (renderOpts.name) {
    case 'ASwitch':
      prop = 'checked';
      break;
  }

  return prop;
}

function getModelEvent(renderOpts) {
  var type = 'change';

  switch (renderOpts.name) {
    case 'AInput':
      type = 'change.value';
      break;

    case 'ARadio':
    case 'ACheckbox':
      type = 'input';
      break;
  }

  return type;
}

function getChangeEvent(renderOpts) {
  return 'change';
}

function getCellEditFilterProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$table.vSize;
  return _.assign(vSize ? {
    size: vSize
  } : {}, defaultProps, renderOpts.props, _defineProperty({}, getModelProp(renderOpts), value));
}

function getItemProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$form.vSize;
  return _.assign(vSize ? {
    size: vSize
  } : {}, defaultProps, renderOpts.props, _defineProperty({}, getModelProp(renderOpts), value));
}

function formatText(cellValue) {
  return '' + (isEmptyValue(cellValue) ? '' : cellValue);
}

function getCellLabelVNs(h, renderOpts, params, cellLabel) {
  var placeholder = renderOpts.placeholder;
  return [h('span', {
    "class": 'vxe-cell--label'
  }, placeholder && isEmptyValue(cellLabel) ? [h('span', {
    "class": 'vxe-cell--placeholder'
  }, formatText(placeholder))] : formatText(cellLabel))];
}

function getNativeOns(renderOpts, params) {
  var nativeEvents = renderOpts.nativeEvents;
  var nativeOns = {};

  _.each(nativeEvents, function (func, key) {
    nativeOns[key] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      func.apply(void 0, [params].concat(args));
    };
  });

  return nativeOns;
}

function getOns(renderOpts, params, inputFunc, changeFunc) {
  var events = renderOpts.events;
  var modelEvent = getModelEvent(renderOpts);
  var changeEvent = getChangeEvent(renderOpts);
  var isSameEvent = changeEvent === modelEvent;
  var ons = {};

  _.each(events, function (func, key) {
    ons[key] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      func.apply(void 0, [params].concat(args));
    };
  });

  if (inputFunc) {
    ons[modelEvent] = function (targetEvnt) {
      inputFunc(targetEvnt);

      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt);
      }

      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt);
      }
    };
  }

  if (!isSameEvent && changeFunc) {
    ons[changeEvent] = function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      changeFunc.apply(void 0, args);

      if (events && events[changeEvent]) {
        events[changeEvent].apply(events, [params].concat(args));
      }
    };
  }

  return ons;
}

function getEditOns(renderOpts, params) {
  var $table = params.$table,
      row = params.row,
      column = params.column;
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    _.set(row, column.property, value);
  }, function () {
    // 处理 change 事件相关逻辑
    $table.updateStatus(params);
  });
}

function getFilterOns(renderOpts, params, option, changeFunc) {
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    option.data = value;
  }, changeFunc);
}

function getItemOns(renderOpts, params) {
  var $form = params.$form,
      data = params.data,
      property = params.property;
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    _.set(data, property, value);
  }, function () {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params);
  });
}

function matchCascaderData(index, list, values, labels) {
  var val = values[index];

  if (list && values.length > index) {
    _.each(list, function (item) {
      if (item.value === val) {
        labels.push(item.label);
        matchCascaderData(++index, item.children, values, labels);
      }
    });
  }
}

function formatDatePicker(defaultFormat) {
  return function (h, renderOpts, params) {
    return getCellLabelVNs(h, renderOpts, params, getDatePickerCellValue(renderOpts, params, defaultFormat));
  };
}

function getSelectCellValue(renderOpts, params) {
  var _renderOpts$options = renderOpts.options,
      options = _renderOpts$options === void 0 ? [] : _renderOpts$options,
      optionGroups = renderOpts.optionGroups,
      _renderOpts$props = renderOpts.props,
      props = _renderOpts$props === void 0 ? {} : _renderOpts$props,
      _renderOpts$optionPro = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro,
      _renderOpts$optionGro = renderOpts.optionGroupProps,
      optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
  var row = params.row,
      column = params.column;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var groupOptions = optionGroupProps.options || 'options';

  var cellValue = _.get(row, column.property);

  if (!isEmptyValue(cellValue)) {
    return _.map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
      var selectItem;

      for (var index = 0; index < optionGroups.length; index++) {
        selectItem = _.find(optionGroups[index][groupOptions], function (item) {
          return item[valueProp] === value;
        });

        if (selectItem) {
          break;
        }
      }

      return selectItem ? selectItem[labelProp] : value;
    } : function (value) {
      var selectItem = _.find(options, function (item) {
        return item[valueProp] === value;
      });

      return selectItem ? selectItem[labelProp] : value;
    }).join(', ');
  }

  return '';
}

function getCascaderCellValue(renderOpts, params) {
  var _renderOpts$props2 = renderOpts.props,
      props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;
  var row = params.row,
      column = params.column;

  var cellValue = _.get(row, column.property);

  var values = cellValue || [];
  var labels = [];
  matchCascaderData(0, props.options, values, labels);
  return (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" ".concat(props.separator || '/', " "));
}

function getRangePickerCellValue(renderOpts, params) {
  var _renderOpts$props3 = renderOpts.props,
      props = _renderOpts$props3 === void 0 ? {} : _renderOpts$props3;
  var row = params.row,
      column = params.column;

  var cellValue = _.get(row, column.property);

  if (_.isArray(cellValue)) {
    cellValue = _.map(cellValue, function (date) {
      return date.format(props.format || 'YYYY-MM-DD');
    }).join(' ~ ');
  }

  return cellValue;
}

function getTreeSelectCellValue(renderOpts, params) {
  var _renderOpts$props4 = renderOpts.props,
      props = _renderOpts$props4 === void 0 ? {} : _renderOpts$props4;
  var treeData = props.treeData,
      treeCheckable = props.treeCheckable;
  var row = params.row,
      column = params.column;

  var cellValue = _.get(row, column.property);

  if (!isEmptyValue(cellValue)) {
    return _.map(treeCheckable ? cellValue : [cellValue], function (value) {
      var matchObj = _xeUtils["default"].findTree(treeData, function (item) {
        return item.value === value;
      }, {
        children: 'children'
      });

      return matchObj ? matchObj.item.title : value;
    }).join(', ');
  }

  return cellValue;
}

function getDatePickerCellValue(renderOpts, params, defaultFormat) {
  var _renderOpts$props5 = renderOpts.props,
      props = _renderOpts$props5 === void 0 ? {} : _renderOpts$props5;
  var row = params.row,
      column = params.column;

  var cellValue = _.get(row, column.property);

  if (cellValue) {
    cellValue = cellValue.format(props.format || defaultFormat);
  }

  return cellValue;
}

function createEditRender(defaultProps) {
  return function (h, renderOpts, params) {
    var row = params.row,
        column = params.column;
    var attrs = renderOpts.attrs;

    var cellValue = _.get(row, column.property);

    return [h(renderOpts.name, {
      attrs: attrs,
      props: getCellEditFilterProps(renderOpts, params, cellValue, defaultProps),
      on: getEditOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    })];
  };
}

function defaultButtonEditRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  return [h('a-button', {
    attrs: attrs,
    props: getCellEditFilterProps(renderOpts, params, null),
    on: getOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  }, cellText(h, renderOpts.content))];
}

function defaultButtonsEditRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonEditRender(h, childRenderOpts, params)[0];
  });
}

function createFilterRender(defaultProps) {
  return function (h, renderOpts, params) {
    var column = params.column;
    var name = renderOpts.name,
        attrs = renderOpts.attrs;
    return [h('div', {
      "class": 'vxe-table--filter-antd-wrapper'
    }, column.filters.map(function (option, oIndex) {
      var optionValue = option.data;
      return h(name, {
        key: oIndex,
        attrs: attrs,
        props: getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
        on: getFilterOns(renderOpts, params, option, function () {
          // 处理 change 事件相关逻辑
          handleConfirmFilter(params, !!option.data, option);
        }),
        nativeOn: getNativeOns(renderOpts, params)
      });
    }))];
  };
}

function handleConfirmFilter(params, checked, option) {
  var $panel = params.$panel;
  $panel.changeOption({}, checked, option);
}
/**
 * 模糊匹配
 * @param params
 */


function defaultFuzzyFilterMethod(params) {
  var option = params.option,
      row = params.row,
      column = params.column;
  var data = option.data;

  var cellValue = _.get(row, column.property);

  return _.toString(cellValue).indexOf(data) > -1;
}
/**
 * 精确匹配
 * @param params
 */


function defaultExactFilterMethod(params) {
  var option = params.option,
      row = params.row,
      column = params.column;
  var data = option.data;

  var cellValue = _.get(row, column.property);
  /* eslint-disable eqeqeq */


  return cellValue === data;
}

function renderOptions(h, options, optionProps) {
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  return _.map(options, function (item, oIndex) {
    return h('a-select-option', {
      key: oIndex,
      props: {
        value: item[valueProp],
        disabled: item.disabled
      }
    }, item[labelProp]);
  });
}

function cellText(h, cellValue) {
  return [formatText(cellValue)];
}

function createFormItemRender(defaultProps) {
  return function (h, renderOpts, params) {
    var data = params.data,
        property = params.property;
    var name = renderOpts.name;
    var attrs = renderOpts.attrs;

    var itemValue = _.get(data, property);

    return [h(name, {
      attrs: attrs,
      props: getItemProps(renderOpts, params, itemValue, defaultProps),
      on: getItemOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    })];
  };
}

function defaultButtonItemRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  var props = getItemProps(renderOpts, params, null);
  return [h('a-button', {
    attrs: attrs,
    props: props,
    on: getOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  }, cellText(h, renderOpts.content || props.content))];
}

function defaultButtonsItemRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonItemRender(h, childRenderOpts, params)[0];
  });
}

function createDatePickerExportMethod(defaultFormat) {
  return function (params) {
    var row = params.row,
        column = params.column,
        options = params.options;
    return options && options.original ? _.get(row, column.property) : getDatePickerCellValue(column.editRender || column.cellRender, params, defaultFormat);
  };
}

function createExportMethod(getExportCellValue) {
  return function (params) {
    var row = params.row,
        column = params.column,
        options = params.options;
    return options && options.original ? _.get(row, column.property) : getExportCellValue(column.editRender || column.cellRender, params);
  };
}

function createFormItemRadioAndCheckboxRender() {
  return function (h, renderOpts, params) {
    var name = renderOpts.name,
        _renderOpts$options2 = renderOpts.options,
        options = _renderOpts$options2 === void 0 ? [] : _renderOpts$options2,
        _renderOpts$optionPro2 = renderOpts.optionProps,
        optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2;
    var data = params.data,
        property = params.property;
    var attrs = renderOpts.attrs;
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';

    var itemValue = _.get(data, property);

    return [h("".concat(name, "Group"), {
      attrs: attrs,
      props: getItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    }, options.map(function (option, oIndex) {
      return h(name, {
        key: oIndex,
        props: {
          value: option[valueProp],
          disabled: option.disabled
        }
      }, option[labelProp]);
    }))];
  };
}
/**
 * 检查触发源是否属于目标节点
 */


function getEventTargetNode(evnt, container, className) {
  var targetElem;
  var target = evnt.target;

  while (target && target.nodeType && target !== document) {
    if (className && target.className && target.className.split && target.className.split(' ').indexOf(className) > -1) {
      targetElem = target;
    } else if (target === container) {
      return {
        flag: className ? !!targetElem : true,
        container: container,
        targetElem: targetElem
      };
    }

    target = target.parentNode;
  }

  return {
    flag: false
  };
}
/**
 * 事件兼容性处理
 */


function handleClearEvent(params, e) {
  var bodyElem = document.body;
  var evnt = params.$event || e;

  if ( // 下拉框
  getEventTargetNode(evnt, bodyElem, 'ant-select-dropdown').flag || // 级联
  getEventTargetNode(evnt, bodyElem, 'ant-cascader-menus').flag || // 日期
  getEventTargetNode(evnt, bodyElem, 'ant-calendar-picker-container').flag || // 时间选择
  getEventTargetNode(evnt, bodyElem, 'ant-time-picker-panel').flag) {
    return false;
  }
}
/**
 * 基于 vxe-table 表格的适配插件，用于兼容 ant-design-vue 组件库
 */


var VXETablePluginAntd = {
  install: function install(_ref) {
    var interceptor = _ref.interceptor,
        renderer = _ref.renderer;
    renderer.mixin({
      AAutoComplete: {
        autofocus: 'input.ant-input',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultExactFilterMethod,
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender()
      },
      AInput: {
        autofocus: 'input.ant-input',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultFuzzyFilterMethod,
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender()
      },
      AInputNumber: {
        autofocus: 'input.ant-input-number-input',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultFuzzyFilterMethod,
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender()
      },
      ASelect: {
        renderEdit: function renderEdit(h, renderOpts, params) {
          var _renderOpts$options3 = renderOpts.options,
              options = _renderOpts$options3 === void 0 ? [] : _renderOpts$options3,
              optionGroups = renderOpts.optionGroups,
              _renderOpts$optionPro3 = renderOpts.optionProps,
              optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
              _renderOpts$optionGro2 = renderOpts.optionGroupProps,
              optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
          var row = params.row,
              column = params.column;
          var attrs = renderOpts.attrs;

          var cellValue = _.get(row, column.property);

          var props = getCellEditFilterProps(renderOpts, params, cellValue);
          var on = getEditOns(renderOpts, params);
          var nativeOn = getNativeOns(renderOpts, params);

          if (optionGroups) {
            var groupOptions = optionGroupProps.options || 'options';
            var groupLabel = optionGroupProps.label || 'label';
            return [h('a-select', {
              props: props,
              attrs: attrs,
              on: on,
              nativeOn: nativeOn
            }, _.map(optionGroups, function (group, gIndex) {
              return h('a-select-opt-group', {
                key: gIndex
              }, [h('span', {
                slot: 'label'
              }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
            }))];
          }

          return [h('a-select', {
            props: props,
            attrs: attrs,
            on: on,
            nativeOn: nativeOn
          }, renderOptions(h, options, optionProps))];
        },
        renderCell: function renderCell(h, renderOpts, params) {
          return getCellLabelVNs(h, renderOpts, params, getSelectCellValue(renderOpts, params));
        },
        renderFilter: function renderFilter(h, renderOpts, params) {
          var _renderOpts$options4 = renderOpts.options,
              options = _renderOpts$options4 === void 0 ? [] : _renderOpts$options4,
              optionGroups = renderOpts.optionGroups,
              _renderOpts$optionPro4 = renderOpts.optionProps,
              optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
              _renderOpts$optionGro3 = renderOpts.optionGroupProps,
              optionGroupProps = _renderOpts$optionGro3 === void 0 ? {} : _renderOpts$optionGro3;
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          var column = params.column;
          var attrs = renderOpts.attrs;
          var nativeOn = getNativeOns(renderOpts, params);
          return [h('div', {
            "class": 'vxe-table--filter-antd-wrapper'
          }, optionGroups ? column.filters.map(function (option, oIndex) {
            var optionValue = option.data;
            var props = getCellEditFilterProps(renderOpts, params, optionValue);
            return h('a-select', {
              key: oIndex,
              attrs: attrs,
              props: props,
              on: getFilterOns(renderOpts, params, option, function () {
                // 处理 change 事件相关逻辑
                handleConfirmFilter(params, props.mode === 'multiple' ? option.data && option.data.length > 0 : !_.isNil(option.data), option);
              }),
              nativeOn: nativeOn
            }, _.map(optionGroups, function (group, gIndex) {
              return h('a-select-opt-group', {
                key: gIndex
              }, [h('span', {
                slot: 'label'
              }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
            }));
          }) : column.filters.map(function (option, oIndex) {
            var optionValue = option.data;
            var props = getCellEditFilterProps(renderOpts, params, optionValue);
            return h('a-select', {
              key: oIndex,
              attrs: attrs,
              props: props,
              on: getFilterOns(renderOpts, params, option, function () {
                // 处理 change 事件相关逻辑
                handleConfirmFilter(params, props.mode === 'multiple' ? option.data && option.data.length > 0 : !_.isNil(option.data), option);
              }),
              nativeOn: nativeOn
            }, renderOptions(h, options, optionProps));
          }))];
        },
        defaultFilterMethod: function defaultFilterMethod(params) {
          var option = params.option,
              row = params.row,
              column = params.column;
          var data = option.data;
          var property = column.property,
              renderOpts = column.filterRender;
          var _renderOpts$props6 = renderOpts.props,
              props = _renderOpts$props6 === void 0 ? {} : _renderOpts$props6;

          var cellValue = _.get(row, property);

          if (props.mode === 'multiple') {
            if (_.isArray(cellValue)) {
              return _.intersection(cellValue, data).length === data.length;
            }

            return data.indexOf(cellValue) > -1;
          }
          /* eslint-disable eqeqeq */


          return cellValue == data;
        },
        renderItem: function renderItem(h, renderOpts, params) {
          var _renderOpts$options5 = renderOpts.options,
              options = _renderOpts$options5 === void 0 ? [] : _renderOpts$options5,
              optionGroups = renderOpts.optionGroups,
              _renderOpts$optionPro5 = renderOpts.optionProps,
              optionProps = _renderOpts$optionPro5 === void 0 ? {} : _renderOpts$optionPro5,
              _renderOpts$optionGro4 = renderOpts.optionGroupProps,
              optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
          var data = params.data,
              property = params.property;
          var attrs = renderOpts.attrs;

          var itemValue = _.get(data, property);

          var props = getItemProps(renderOpts, params, itemValue);
          var on = getItemOns(renderOpts, params);
          var nativeOn = getNativeOns(renderOpts, params);

          if (optionGroups) {
            var groupOptions = optionGroupProps.options || 'options';
            var groupLabel = optionGroupProps.label || 'label';
            return [h('a-select', {
              attrs: attrs,
              props: props,
              on: on,
              nativeOn: nativeOn
            }, _.map(optionGroups, function (group, gIndex) {
              return h('a-select-opt-group', {
                key: gIndex
              }, [h('span', {
                slot: 'label'
              }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
            }))];
          }

          return [h('a-select', {
            attrs: attrs,
            props: props,
            on: on,
            nativeOn: nativeOn
          }, renderOptions(h, options, optionProps))];
        },
        renderItemContent: function renderItemContent(h, renderOpts, params) {
          var _renderOpts$options6 = renderOpts.options,
              options = _renderOpts$options6 === void 0 ? [] : _renderOpts$options6,
              optionGroups = renderOpts.optionGroups,
              _renderOpts$optionPro6 = renderOpts.optionProps,
              optionProps = _renderOpts$optionPro6 === void 0 ? {} : _renderOpts$optionPro6,
              _renderOpts$optionGro5 = renderOpts.optionGroupProps,
              optionGroupProps = _renderOpts$optionGro5 === void 0 ? {} : _renderOpts$optionGro5;
          var data = params.data,
              property = params.property;
          var attrs = renderOpts.attrs;

          var itemValue = _.get(data, property);

          var props = getItemProps(renderOpts, params, itemValue);
          var on = getItemOns(renderOpts, params);
          var nativeOn = getNativeOns(renderOpts, params);

          if (optionGroups) {
            var groupOptions = optionGroupProps.options || 'options';
            var groupLabel = optionGroupProps.label || 'label';
            return [h('a-select', {
              attrs: attrs,
              props: props,
              on: on,
              nativeOn: nativeOn
            }, _.map(optionGroups, function (group, gIndex) {
              return h('a-select-opt-group', {
                key: gIndex
              }, [h('span', {
                slot: 'label'
              }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
            }))];
          }

          return [h('a-select', {
            attrs: attrs,
            props: props,
            on: on,
            nativeOn: nativeOn
          }, renderOptions(h, options, optionProps))];
        },
        cellExportMethod: createExportMethod(getSelectCellValue),
        exportMethod: createExportMethod(getSelectCellValue)
      },
      ACascader: {
        renderEdit: createEditRender(),
        renderCell: function renderCell(h, renderOpts, params) {
          return getCellLabelVNs(h, renderOpts, params, getCascaderCellValue(renderOpts, params));
        },
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createExportMethod(getCascaderCellValue),
        exportMethod: createExportMethod(getCascaderCellValue)
      },
      ADatePicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('YYYY-MM-DD'),
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createDatePickerExportMethod('YYYY-MM-DD'),
        exportMethod: createDatePickerExportMethod('YYYY-MM-DD')
      },
      AMonthPicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('YYYY-MM'),
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createDatePickerExportMethod('YYYY-MM'),
        exportMethod: createDatePickerExportMethod('YYYY-MM')
      },
      ARangePicker: {
        renderEdit: createEditRender(),
        renderCell: function renderCell(h, renderOpts, params) {
          return getCellLabelVNs(h, renderOpts, params, getRangePickerCellValue(renderOpts, params));
        },
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createExportMethod(getRangePickerCellValue),
        exportMethod: createExportMethod(getRangePickerCellValue)
      },
      AWeekPicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('YYYY-WW周'),
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createDatePickerExportMethod('YYYY-WW周'),
        exportMethod: createDatePickerExportMethod('YYYY-WW周')
      },
      ATimePicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('HH:mm:ss'),
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createDatePickerExportMethod('HH:mm:ss'),
        exportMethod: createDatePickerExportMethod('HH:mm:ss')
      },
      ATreeSelect: {
        renderEdit: createEditRender(),
        renderCell: function renderCell(h, renderOpts, params) {
          return getCellLabelVNs(h, renderOpts, params, getTreeSelectCellValue(renderOpts, params));
        },
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender(),
        cellExportMethod: createExportMethod(getTreeSelectCellValue),
        exportMethod: createExportMethod(getTreeSelectCellValue)
      },
      ARate: {
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultExactFilterMethod,
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender()
      },
      ASwitch: {
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: function renderFilter(h, renderOpts, params) {
          var column = params.column;
          var name = renderOpts.name,
              attrs = renderOpts.attrs;
          var nativeOn = getNativeOns(renderOpts, params);
          return [h('div', {
            "class": 'vxe-table--filter-antd-wrapper'
          }, column.filters.map(function (option, oIndex) {
            var optionValue = option.data;
            return h(name, {
              key: oIndex,
              attrs: attrs,
              props: getCellEditFilterProps(renderOpts, params, optionValue),
              on: getFilterOns(renderOpts, params, option, function () {
                // 处理 change 事件相关逻辑
                handleConfirmFilter(params, _.isBoolean(option.data), option);
              }),
              nativeOn: nativeOn
            });
          }))];
        },
        defaultFilterMethod: defaultExactFilterMethod,
        renderItem: createFormItemRender(),
        renderItemContent: createFormItemRender()
      },
      ARadio: {
        renderItem: createFormItemRadioAndCheckboxRender(),
        renderItemContent: createFormItemRadioAndCheckboxRender()
      },
      ACheckbox: {
        renderItem: createFormItemRadioAndCheckboxRender(),
        renderItemContent: createFormItemRadioAndCheckboxRender()
      },
      AButton: {
        renderEdit: defaultButtonEditRender,
        renderDefault: defaultButtonEditRender,
        renderItem: defaultButtonItemRender,
        renderItemContent: defaultButtonItemRender
      },
      AButtons: {
        renderEdit: defaultButtonsEditRender,
        renderDefault: defaultButtonsEditRender,
        renderItem: defaultButtonsItemRender,
        renderItemContent: defaultButtonsItemRender
      }
    });
    interceptor.add('event.clearFilter', handleClearEvent);
    interceptor.add('event.clearActived', handleClearEvent);
    interceptor.add('event.clearAreas', handleClearEvent);
  }
};
exports.VXETablePluginAntd = VXETablePluginAntd;

if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
  window.VXETable.use(VXETablePluginAntd);
}

var _default = VXETablePluginAntd;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIiwiaW5kZXguanMiXSwibmFtZXMiOlsiaXNFbXB0eVZhbHVlIiwiY2VsbFZhbHVlIiwidW5kZWZpbmVkIiwiZ2V0TW9kZWxQcm9wIiwicmVuZGVyT3B0cyIsInByb3AiLCJuYW1lIiwiZ2V0TW9kZWxFdmVudCIsInR5cGUiLCJnZXRDaGFuZ2VFdmVudCIsImdldENlbGxFZGl0RmlsdGVyUHJvcHMiLCJwYXJhbXMiLCJ2YWx1ZSIsImRlZmF1bHRQcm9wcyIsInZTaXplIiwiJHRhYmxlIiwiXyIsImFzc2lnbiIsInNpemUiLCJwcm9wcyIsImdldEl0ZW1Qcm9wcyIsIiRmb3JtIiwiZm9ybWF0VGV4dCIsImdldENlbGxMYWJlbFZOcyIsImgiLCJjZWxsTGFiZWwiLCJwbGFjZWhvbGRlciIsImdldE5hdGl2ZU9ucyIsIm5hdGl2ZUV2ZW50cyIsIm5hdGl2ZU9ucyIsImVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsInRhcmdldEV2bnQiLCJnZXRFZGl0T25zIiwicm93IiwiY29sdW1uIiwic2V0IiwicHJvcGVydHkiLCJ1cGRhdGVTdGF0dXMiLCJnZXRGaWx0ZXJPbnMiLCJvcHRpb24iLCJkYXRhIiwiZ2V0SXRlbU9ucyIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiaXRlbSIsInB1c2giLCJsYWJlbCIsImNoaWxkcmVuIiwiZm9ybWF0RGF0ZVBpY2tlciIsImRlZmF1bHRGb3JtYXQiLCJnZXREYXRlUGlja2VyQ2VsbFZhbHVlIiwiZ2V0U2VsZWN0Q2VsbFZhbHVlIiwib3B0aW9ucyIsIm9wdGlvbkdyb3VwcyIsIm9wdGlvblByb3BzIiwib3B0aW9uR3JvdXBQcm9wcyIsImxhYmVsUHJvcCIsInZhbHVlUHJvcCIsImdyb3VwT3B0aW9ucyIsImdldCIsIm1hcCIsIm1vZGUiLCJzZWxlY3RJdGVtIiwiZmluZCIsImpvaW4iLCJnZXRDYXNjYWRlckNlbGxWYWx1ZSIsInNob3dBbGxMZXZlbHMiLCJzbGljZSIsInNlcGFyYXRvciIsImdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIiwiaXNBcnJheSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZURhdGEiLCJ0cmVlQ2hlY2thYmxlIiwibWF0Y2hPYmoiLCJYRVV0aWxzIiwiZmluZFRyZWUiLCJ0aXRsZSIsImNyZWF0ZUVkaXRSZW5kZXIiLCJhdHRycyIsIm9uIiwibmF0aXZlT24iLCJkZWZhdWx0QnV0dG9uRWRpdFJlbmRlciIsImNlbGxUZXh0IiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJvSW5kZXgiLCJvcHRpb25WYWx1ZSIsImhhbmRsZUNvbmZpcm1GaWx0ZXIiLCJjaGVja2VkIiwiJHBhbmVsIiwiY2hhbmdlT3B0aW9uIiwiZGVmYXVsdEZ1enp5RmlsdGVyTWV0aG9kIiwidG9TdHJpbmciLCJpbmRleE9mIiwiZGVmYXVsdEV4YWN0RmlsdGVyTWV0aG9kIiwicmVuZGVyT3B0aW9ucyIsImRpc2FibGVkIiwiY3JlYXRlRm9ybUl0ZW1SZW5kZXIiLCJpdGVtVmFsdWUiLCJkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciIsImRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJvcmlnaW5hbCIsImVkaXRSZW5kZXIiLCJjZWxsUmVuZGVyIiwiY3JlYXRlRXhwb3J0TWV0aG9kIiwiZ2V0RXhwb3J0Q2VsbFZhbHVlIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwiZ2V0RXZlbnRUYXJnZXROb2RlIiwiZXZudCIsImNvbnRhaW5lciIsImNsYXNzTmFtZSIsInRhcmdldEVsZW0iLCJ0YXJnZXQiLCJub2RlVHlwZSIsImRvY3VtZW50Iiwic3BsaXQiLCJmbGFnIiwicGFyZW50Tm9kZSIsImhhbmRsZUNsZWFyRXZlbnQiLCJlIiwiYm9keUVsZW0iLCJib2R5IiwiJGV2ZW50IiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJyZW5kZXJJdGVtIiwicmVuZGVySXRlbUNvbnRlbnQiLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0IiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsImNvbmNhdCIsInJlbmRlckNlbGwiLCJpc05pbCIsImZpbHRlclJlbmRlciIsImludGVyc2VjdGlvbiIsImNlbGxFeHBvcnRNZXRob2QiLCJleHBvcnRNZXRob2QiLCJBQ2FzY2FkZXIiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsIkFSYXRlIiwiQVN3aXRjaCIsImlzQm9vbGVhbiIsIkFSYWRpbyIsIkFDaGVja2JveCIsIkFCdXR0b24iLCJBQnV0dG9ucyIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQXFCQSxTQUFTQSxZQUFULENBQXVCQyxTQUF2QixFQUFxQztFQUNuQyxPQUFPQSxTQUFTLEtBQUssSUFBZCxJQUFzQkEsU0FBUyxLQUFLQyxTQUFwQyxJQUFpREQsU0FBUyxLQUFLLEVBQXRFO0FBQ0Q7O0FBRUQsU0FBU0UsWUFBVCxDQUF1QkMsVUFBdkIsRUFBZ0Q7RUFDOUMsSUFBSUMsSUFBSSxHQUFHLE9B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RUFBRXJDO01BSlosQ0FyVUk7TUEyVWJpRSxRQUFRLEVBQUU7UUFDUmhDLFVBQVUsRUFBRW5ELHdCQURKO1FBRVJrRCxhQUFhLEVBQUVsRCx3QkFGUDtRQUdSc0QsVUFBVSxFQUFFbkMsd0JBSEo7UUFJUm9DLGlCQUFpQixFQUFFcEM7TUFKWDtJQTNVRyxDQUFmO0lBbVZBMEIsV0FBVyxDQUFDdUMsR0FBWixDQUFnQixtQkFBaEIsRUFBcUM5QyxnQkFBckM7SUFDQU8sV0FBVyxDQUFDdUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0M5QyxnQkFBdEM7SUFDQU8sV0FBVyxDQUFDdUMsR0FBWixDQUFnQixrQkFBaEIsRUFBb0M5QyxnQkFBcEM7RUFDRDtBQXhWK0IsQ0FBM0I7OztBQTJWUCxJQUFJLE9BQU8rQyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUNDLFFBQXhDLElBQW9ERCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQXhFLEVBQTZFO0VBQzNFRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CNUMsa0JBQXBCO0FBQ0Q7O2VBRWNBLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENyZWF0ZUVsZW1lbnQgfSBmcm9tICd2dWUnXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzJ1xuaW1wb3J0IHtcbiAgVlhFVGFibGUsXG4gIFJlbmRlclBhcmFtcyxcbiAgT3B0aW9uUHJvcHMsXG4gIFJlbmRlck9wdGlvbnMsXG4gIEludGVyY2VwdG9yUGFyYW1zLFxuICBUYWJsZVJlbmRlclBhcmFtcyxcbiAgQ29sdW1uRmlsdGVyUGFyYW1zLFxuICBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLFxuICBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucyxcbiAgQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsXG4gIEZvcm1JdGVtUmVuZGVyT3B0aW9ucyxcbiAgQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyxcbiAgQ29sdW1uRWRpdFJlbmRlclBhcmFtcyxcbiAgQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLFxuICBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMsXG4gIENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsXG4gIEZvcm1JdGVtUmVuZGVyUGFyYW1zXG59IGZyb20gJ3Z4ZS10YWJsZSdcblxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xuICByZXR1cm4gY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJydcbn1cblxuZnVuY3Rpb24gZ2V0TW9kZWxQcm9wIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XG4gIGxldCBwcm9wID0gJ3ZhbHVlJ1xuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xuICAgIGNhc2UgJ0FTd2l0Y2gnOlxuICAgICAgcHJvcCA9ICdjaGVja2VkJ1xuICAgICAgYnJlYWtcbiAgfVxuICByZXR1cm4gcHJvcFxufVxuXG5mdW5jdGlvbiBnZXRNb2RlbEV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcbiAgICBjYXNlICdBSW5wdXQnOlxuICAgICAgdHlwZSA9ICdjaGFuZ2UudmFsdWUnXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0FSYWRpbyc6XG4gICAgY2FzZSAnQUNoZWNrYm94JzpcbiAgICAgIHR5cGUgPSAnaW5wdXQnXG4gICAgICBicmVha1xuICB9XG4gIHJldHVybiB0eXBlXG59XG5cbmZ1bmN0aW9uIGdldENoYW5nZUV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XG4gIHJldHVybiAnY2hhbmdlJ1xufVxuXG5mdW5jdGlvbiBnZXRDZWxsRWRpdEZpbHRlclByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFRhYmxlUmVuZGVyUGFyYW1zLCB2YWx1ZTogYW55LCBkZWZhdWx0UHJvcHM/OiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSkge1xuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJHRhYmxlXG4gIHJldHVybiBfLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXG59XG5cbmZ1bmN0aW9uIGdldEl0ZW1Qcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiRmb3JtXG4gIHJldHVybiBfLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXG59XG5cbmZ1bmN0aW9uIGZvcm1hdFRleHQgKGNlbGxWYWx1ZTogYW55KSB7XG4gIHJldHVybiAnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKVxufVxuXG5mdW5jdGlvbiBnZXRDZWxsTGFiZWxWTnMgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMsIGNlbGxMYWJlbDogYW55KSB7XG4gIGNvbnN0IHsgcGxhY2Vob2xkZXIgfSA9IHJlbmRlck9wdHNcbiAgcmV0dXJuIFtcbiAgICBoKCdzcGFuJywge1xuICAgICAgY2xhc3M6ICd2eGUtY2VsbC0tbGFiZWwnXG4gICAgfSwgcGxhY2Vob2xkZXIgJiYgaXNFbXB0eVZhbHVlKGNlbGxMYWJlbClcbiAgICAgID8gW1xuICAgICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICBjbGFzczogJ3Z4ZS1jZWxsLS1wbGFjZWhvbGRlcidcbiAgICAgICAgICB9LCBmb3JtYXRUZXh0KHBsYWNlaG9sZGVyKSlcbiAgICAgICAgXVxuICAgICAgOiBmb3JtYXRUZXh0KGNlbGxMYWJlbCkpXG4gIF1cbn1cblxuZnVuY3Rpb24gZ2V0TmF0aXZlT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFJlbmRlclBhcmFtcykge1xuICBjb25zdCB7IG5hdGl2ZUV2ZW50cyB9ID0gcmVuZGVyT3B0c1xuICBjb25zdCBuYXRpdmVPbnM6IHsgW3R5cGU6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fVxuICBfLmVhY2gobmF0aXZlRXZlbnRzLCAoZnVuYzogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XG4gICAgbmF0aXZlT25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcbiAgICAgIGZ1bmMocGFyYW1zLCAuLi5hcmdzKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIG5hdGl2ZU9uc1xufVxuXG5mdW5jdGlvbiBnZXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogUmVuZGVyUGFyYW1zLCBpbnB1dEZ1bmM/OiBGdW5jdGlvbiwgY2hhbmdlRnVuYz86IEZ1bmN0aW9uKSB7XG4gIGNvbnN0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXG4gIGNvbnN0IG1vZGVsRXZlbnQgPSBnZXRNb2RlbEV2ZW50KHJlbmRlck9wdHMpXG4gIGNvbnN0IGNoYW5nZUV2ZW50ID0gZ2V0Q2hhbmdlRXZlbnQocmVuZGVyT3B0cylcbiAgY29uc3QgaXNTYW1lRXZlbnQgPSBjaGFuZ2VFdmVudCA9PT0gbW9kZWxFdmVudFxuICBjb25zdCBvbnM6IHsgW3R5cGU6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fVxuICBfLmVhY2goZXZlbnRzLCAoZnVuYzogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XG4gICAgb25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcbiAgICAgIGZ1bmMocGFyYW1zLCAuLi5hcmdzKVxuICAgIH1cbiAgfSlcbiAgaWYgKGlucHV0RnVuYykge1xuICAgIG9uc1ttb2RlbEV2ZW50XSA9IGZ1bmN0aW9uICh0YXJnZXRFdm50OiBhbnkpIHtcbiAgICAgIGlucHV0RnVuYyh0YXJnZXRFdm50KVxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbbW9kZWxFdmVudF0pIHtcbiAgICAgICAgZXZlbnRzW21vZGVsRXZlbnRdKHBhcmFtcywgdGFyZ2V0RXZudClcbiAgICAgIH1cbiAgICAgIGlmIChpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XG4gICAgICAgIGNoYW5nZUZ1bmModGFyZ2V0RXZudClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XG4gICAgb25zW2NoYW5nZUV2ZW50XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgY2hhbmdlRnVuYyguLi5hcmdzKVxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbY2hhbmdlRXZlbnRdKSB7XG4gICAgICAgIGV2ZW50c1tjaGFuZ2VFdmVudF0ocGFyYW1zLCAuLi5hcmdzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb25zXG59XG5cbmZ1bmN0aW9uIGdldEVkaXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xuICBjb25zdCB7ICR0YWJsZSwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXG4gICAgXy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxuICB9LCAoKSA9PiB7XG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcbiAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0RmlsdGVyT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcywgb3B0aW9uOiBDb2x1bW5GaWx0ZXJQYXJhbXMsIGNoYW5nZUZ1bmM6IEZ1bmN0aW9uKSB7XG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcbiAgICBvcHRpb24uZGF0YSA9IHZhbHVlXG4gIH0sIGNoYW5nZUZ1bmMpXG59XG5cbmZ1bmN0aW9uIGdldEl0ZW1PbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcbiAgY29uc3QgeyAkZm9ybSwgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXG4gICAgXy5zZXQoZGF0YSwgcHJvcGVydHksIHZhbHVlKVxuICB9LCAoKSA9PiB7XG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcbiAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKVxuICB9KVxufVxuXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogYW55W10sIHZhbHVlczogYW55W10sIGxhYmVsczogYW55W10pIHtcbiAgY29uc3QgdmFsID0gdmFsdWVzW2luZGV4XVxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcbiAgICBfLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xuICAgICAgICBsYWJlbHMucHVzaChpdGVtLmxhYmVsKVxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcbiAgICByZXR1cm4gZ2V0Q2VsbExhYmVsVk5zKGgsIHJlbmRlck9wdHMsIHBhcmFtcywgZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMsIGRlZmF1bHRGb3JtYXQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xuICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xuICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XG4gICAgcmV0dXJuIF8ubWFwKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgb3B0aW9uR3JvdXBzXG4gICAgICA/ICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgbGV0IHNlbGVjdEl0ZW1cbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgc2VsZWN0SXRlbSA9IF8uZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXG4gICAgICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXG4gICAgICAgIH1cbiAgICAgIDogKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RJdGVtID0gXy5maW5kKG9wdGlvbnMsIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxuICAgICAgICB9KS5qb2luKCcsICcpXG4gIH1cbiAgcmV0dXJuICcnXG59XG5cbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xuICBjb25zdCBjZWxsVmFsdWUgPSBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcbiAgY29uc3QgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXG4gIGNvbnN0IGxhYmVsczogQXJyYXk8YW55PiA9IFtdXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxuICByZXR1cm4gKHByb3BzLnNob3dBbGxMZXZlbHMgPT09IGZhbHNlID8gbGFiZWxzLnNsaWNlKGxhYmVscy5sZW5ndGggLSAxLCBsYWJlbHMubGVuZ3RoKSA6IGxhYmVscykuam9pbihgICR7cHJvcHMuc2VwYXJhdG9yIHx8ICcvJ30gYClcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXG4gIGxldCBjZWxsVmFsdWUgPSBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcbiAgaWYgKF8uaXNBcnJheShjZWxsVmFsdWUpKSB7XG4gICAgY2VsbFZhbHVlID0gXy5tYXAoY2VsbFZhbHVlLCAoZGF0ZTogYW55KSA9PiBkYXRlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgJ1lZWVktTU0tREQnKSkuam9pbignIH4gJylcbiAgfVxuICByZXR1cm4gY2VsbFZhbHVlXG59XG5cbmZ1bmN0aW9uIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgY29uc3QgeyB0cmVlRGF0YSwgdHJlZUNoZWNrYWJsZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XG4gICAgcmV0dXJuIF8ubWFwKHRyZWVDaGVja2FibGUgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoT2JqID0gWEVVdGlscy5maW5kVHJlZSh0cmVlRGF0YSBhcyBhbnlbXSwgKGl0ZW06IGFueSkgPT4gaXRlbS52YWx1ZSA9PT0gdmFsdWUsIHsgY2hpbGRyZW46ICdjaGlsZHJlbicgfSlcbiAgICAgIHJldHVybiBtYXRjaE9iaiA/IG1hdGNoT2JqLml0ZW0udGl0bGUgOiB2YWx1ZVxuICAgIH0pLmpvaW4oJywgJylcbiAgfVxuICByZXR1cm4gY2VsbFZhbHVlXG59XG5cbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyB8IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXG4gIGxldCBjZWxsVmFsdWUgPSBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcbiAgaWYgKGNlbGxWYWx1ZSkge1xuICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQpXG4gIH1cbiAgcmV0dXJuIGNlbGxWYWx1ZVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcbiAgICBjb25zdCBjZWxsVmFsdWUgPSBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcbiAgICByZXR1cm4gW1xuICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcbiAgICAgICAgYXR0cnMsXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlLCBkZWZhdWx0UHJvcHMpLFxuICAgICAgICBvbjogZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxuICAgICAgICBuYXRpdmVPbjogZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcbiAgICAgIH0pXG4gICAgXVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XG4gIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcbiAgcmV0dXJuIFtcbiAgICBoKCdhLWJ1dHRvbicsIHtcbiAgICAgIGF0dHJzLFxuICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBudWxsKSxcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKSxcbiAgICAgIG5hdGl2ZU9uOiBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCkpXG4gIF1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcykge1xuICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcbiAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXG4gICAgcmV0dXJuIFtcbiAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6ICd2eGUtdGFibGUtLWZpbHRlci1hbnRkLXdyYXBwZXInXG4gICAgICB9LCBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcbiAgICAgICAgcmV0dXJuIGgobmFtZSwge1xuICAgICAgICAgIGtleTogb0luZGV4LFxuICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUsIGRlZmF1bHRQcm9wcyksXG4gICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcbiAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCAhIW9wdGlvbi5kYXRhLCBvcHRpb24pXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmF0aXZlT246IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXG4gICAgICAgIH0pXG4gICAgICB9KSlcbiAgICBdXG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIGNoZWNrZWQ6IGJvb2xlYW4sIG9wdGlvbjogQ29sdW1uRmlsdGVyUGFyYW1zKSB7XG4gIGNvbnN0IHsgJHBhbmVsIH0gPSBwYXJhbXNcbiAgJHBhbmVsLmNoYW5nZU9wdGlvbih7fSwgY2hlY2tlZCwgb3B0aW9uKVxufVxuXG4vKipcbiAqIOaooeeziuWMuemFjVxuICogQHBhcmFtIHBhcmFtc1xuICovXG5mdW5jdGlvbiBkZWZhdWx0RnV6enlGaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XG4gIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXG4gIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxuICByZXR1cm4gXy50b1N0cmluZyhjZWxsVmFsdWUpLmluZGV4T2YoZGF0YSkgPiAtMVxufVxuXG4vKipcbiAqIOeyvuehruWMuemFjVxuICogQHBhcmFtIHBhcmFtc1xuICovXG5mdW5jdGlvbiBkZWZhdWx0RXhhY3RGaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XG4gIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXG4gIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxufVxuXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBDcmVhdGVFbGVtZW50LCBvcHRpb25zOiBhbnlbXSwgb3B0aW9uUHJvcHM6IE9wdGlvblByb3BzKSB7XG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xuICByZXR1cm4gXy5tYXAob3B0aW9ucywgKGl0ZW06IGFueSwgb0luZGV4OiBhbnkpID0+IHtcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xuICAgICAga2V5OiBvSW5kZXgsXG4gICAgICBwcm9wczoge1xuICAgICAgICB2YWx1ZTogaXRlbVt2YWx1ZVByb3BdLFxuICAgICAgICBkaXNhYmxlZDogaXRlbS5kaXNhYmxlZFxuICAgICAgfVxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IENyZWF0ZUVsZW1lbnQsIGNlbGxWYWx1ZTogYW55KSB7XG4gIHJldHVybiBbZm9ybWF0VGV4dChjZWxsVmFsdWUpXVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xuICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xuICAgIGNvbnN0IHsgbmFtZSB9ID0gcmVuZGVyT3B0c1xuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBfLmdldChkYXRhLCBwcm9wZXJ0eSlcbiAgICByZXR1cm4gW1xuICAgICAgaChuYW1lLCB7XG4gICAgICAgIGF0dHJzLFxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlLCBkZWZhdWx0UHJvcHMpLFxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxuICAgICAgICBuYXRpdmVPbjogZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcbiAgICAgIH0pXG4gICAgXVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xuICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG51bGwpXG4gIHJldHVybiBbXG4gICAgaCgnYS1idXR0b24nLCB7XG4gICAgICBhdHRycyxcbiAgICAgIHByb3BzLFxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxuICAgICAgbmF0aXZlT246IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50IHx8IHByb3BzLmNvbnRlbnQpKVxuICBdXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zKSB7XG4gICAgY29uc3QgeyByb3csIGNvbHVtbiwgb3B0aW9ucyB9ID0gcGFyYW1zXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5vcmlnaW5hbCA/IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSA6IGdldERhdGVQaWNrZXJDZWxsVmFsdWUoY29sdW1uLmVkaXRSZW5kZXIgfHwgY29sdW1uLmNlbGxSZW5kZXIsIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFeHBvcnRNZXRob2QgKGdldEV4cG9ydENlbGxWYWx1ZTogRnVuY3Rpb24pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMpIHtcbiAgICBjb25zdCB7IHJvdywgY29sdW1uLCBvcHRpb25zIH0gPSBwYXJhbXNcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLm9yaWdpbmFsID8gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpIDogZ2V0RXhwb3J0Q2VsbFZhbHVlKGNvbHVtbi5lZGl0UmVuZGVyIHx8IGNvbHVtbi5jZWxsUmVuZGVyLCBwYXJhbXMpXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xuICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXG4gICAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IF8uZ2V0KGRhdGEsIHByb3BlcnR5KVxuICAgIHJldHVybiBbXG4gICAgICBoKGAke25hbWV9R3JvdXBgLCB7XG4gICAgICAgIGF0dHJzLFxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcbiAgICAgICAgb246IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKSxcbiAgICAgICAgbmF0aXZlT246IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXG4gICAgICB9LCBvcHRpb25zLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGgobmFtZSwge1xuICAgICAgICAgIGtleTogb0luZGV4LFxuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICB2YWx1ZTogb3B0aW9uW3ZhbHVlUHJvcF0sXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uLmRpc2FibGVkXG4gICAgICAgICAgfVxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcbiAgICAgIH0pKVxuICAgIF1cbiAgfVxufVxuXG4vKipcbiAqIOajgOafpeinpuWPkea6kOaYr+WQpuWxnuS6juebruagh+iKgueCuVxuICovXG5mdW5jdGlvbiBnZXRFdmVudFRhcmdldE5vZGUgKGV2bnQ6IGFueSwgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgbGV0IHRhcmdldEVsZW1cbiAgbGV0IHRhcmdldCA9IGV2bnQudGFyZ2V0XG4gIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0Lm5vZGVUeXBlICYmIHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICBpZiAoY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCAmJiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcbiAgICAgIHRhcmdldEVsZW0gPSB0YXJnZXRcbiAgICB9IGVsc2UgaWYgKHRhcmdldCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfVxuICAgIH1cbiAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICB9XG4gIHJldHVybiB7IGZsYWc6IGZhbHNlIH1cbn1cblxuLyoqXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcbiAqL1xuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBJbnRlcmNlcHRvclBhcmFtcywgZTogYW55KSB7XG4gIGNvbnN0IGJvZHlFbGVtOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmJvZHlcbiAgY29uc3QgZXZudCA9IHBhcmFtcy4kZXZlbnQgfHwgZVxuICBpZiAoXG4gICAgLy8g5LiL5ouJ5qGGXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcbiAgICAvLyDnuqfogZRcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XG4gICAgLy8g5pel5pyfXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XG4gICAgLy8g5pe26Ze06YCJ5oupXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xuICApIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5kZWNsYXJlIG1vZHVsZSAndnhlLXRhYmxlJyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBpbnRlcmZhY2UgUmVuZGVyZXJNYXBPcHRpb25zIHtcbiAgICBkZWZhdWx0RmlsdGVyTWV0aG9kPyAocGFyYW1zOiBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMpOiBib29sZWFuO1xuICB9XG59XG5cbi8qKlxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXG4gKi9cbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XG4gIGluc3RhbGwgKHsgaW50ZXJjZXB0b3IsIHJlbmRlcmVyIH06IHR5cGVvZiBWWEVUYWJsZSkge1xuICAgIHJlbmRlcmVyLm1peGluKHtcbiAgICAgIEFBdXRvQ29tcGxldGU6IHtcbiAgICAgICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcbiAgICAgICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRFeGFjdEZpbHRlck1ldGhvZCxcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcbiAgICAgIH0sXG4gICAgICBBSW5wdXQ6IHtcbiAgICAgICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcbiAgICAgICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRGdXp6eUZpbHRlck1ldGhvZCxcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcbiAgICAgIH0sXG4gICAgICBBSW5wdXROdW1iZXI6IHtcbiAgICAgICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXG4gICAgICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxuICAgICAgICBkZWZhdWx0RmlsdGVyTWV0aG9kOiBkZWZhdWx0RnV6enlGaWx0ZXJNZXRob2QsXG4gICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXG4gICAgICB9LFxuICAgICAgQVNlbGVjdDoge1xuICAgICAgICByZW5kZXJFZGl0IChoLCByZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICAgICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgICAgICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcbiAgICAgICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXG4gICAgICAgICAgY29uc3QgY2VsbFZhbHVlID0gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXG4gICAgICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxuICAgICAgICAgIGNvbnN0IG9uID0gZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXG4gICAgICAgICAgY29uc3QgbmF0aXZlT24gPSBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xuICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICAgIG9uLFxuICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgIH0sIF8ubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcbiAgICAgICAgICAgICAgICAgIGtleTogZ0luZGV4XG4gICAgICAgICAgICAgICAgfSwgW1xuICAgICAgICAgICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xuICAgICAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXG4gICAgICAgICAgICAgICAgXS5jb25jYXQoXG4gICAgICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XG4gICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgb24sXG4gICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlckNlbGwgKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBnZXRDZWxsTGFiZWxWTnMoaCwgcmVuZGVyT3B0cywgcGFyYW1zLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyRmlsdGVyIChoLCByZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICAgICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXG4gICAgICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xuICAgICAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcbiAgICAgICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXG4gICAgICAgICAgY29uc3QgbmF0aXZlT24gPSBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItYW50ZC13cmFwcGVyJ1xuICAgICAgICAgICAgfSwgb3B0aW9uR3JvdXBzXG4gICAgICAgICAgICAgID8gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wcyA9IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XG4gICAgICAgICAgICAgICAgICBrZXk6IG9JbmRleCxcbiAgICAgICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gKG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDApIDogIV8uaXNOaWwob3B0aW9uLmRhdGEpLCBvcHRpb24pXG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgICAgfSwgXy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogZ0luZGV4XG4gICAgICAgICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xuICAgICAgICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcbiAgICAgICAgICAgICAgICAgIF0uY29uY2F0KFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgOiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcbiAgICAgICAgICAgICAgICAgIGtleTogb0luZGV4LFxuICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyAob3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCkgOiAhXy5pc05pbChvcHRpb24uZGF0YSksIG9wdGlvbilcbiAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgbmF0aXZlT25cbiAgICAgICAgICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0RmlsdGVyTWV0aG9kIChwYXJhbXMpIHtcbiAgICAgICAgICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xuICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXG4gICAgICAgICAgY29uc3QgeyBwcm9wZXJ0eSwgZmlsdGVyUmVuZGVyOiByZW5kZXJPcHRzIH0gPSBjb2x1bW5cbiAgICAgICAgICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcbiAgICAgICAgICBjb25zdCBjZWxsVmFsdWUgPSBfLmdldChyb3csIHByb3BlcnR5KVxuICAgICAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGNlbGxWYWx1ZSwgZGF0YSkubGVuZ3RoID09PSBkYXRhLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcbiAgICAgICAgICB9XG4gICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG4gICAgICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlckl0ZW0gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xuICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xuICAgICAgICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xuICAgICAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcbiAgICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSBfLmdldChkYXRhLCBwcm9wZXJ0eSlcbiAgICAgICAgICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSlcbiAgICAgICAgICBjb25zdCBvbiA9IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgIGNvbnN0IG5hdGl2ZU9uID0gZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcbiAgICAgICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXG4gICAgICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcbiAgICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICBvbixcbiAgICAgICAgICAgICAgICBuYXRpdmVPblxuICAgICAgICAgICAgICB9LCBfLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XG4gICAgICAgICAgICAgICAgICBrZXk6IGdJbmRleFxuICAgICAgICAgICAgICAgIH0sIFtcbiAgICAgICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcbiAgICAgICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxuICAgICAgICAgICAgICAgIF0uY29uY2F0KFxuICAgICAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xuICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgIG9uLFxuICAgICAgICAgICAgICBuYXRpdmVPblxuICAgICAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICByZW5kZXJJdGVtQ29udGVudCAoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXG4gICAgICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXG4gICAgICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xuICAgICAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IF8uZ2V0KGRhdGEsIHByb3BlcnR5KVxuICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKVxuICAgICAgICAgIGNvbnN0IG9uID0gZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXG4gICAgICAgICAgY29uc3QgbmF0aXZlT24gPSBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xuICAgICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgIG9uLFxuICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgIH0sIF8ubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcbiAgICAgICAgICAgICAgICAgIGtleTogZ0luZGV4XG4gICAgICAgICAgICAgICAgfSwgW1xuICAgICAgICAgICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xuICAgICAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXG4gICAgICAgICAgICAgICAgXS5jb25jYXQoXG4gICAgICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XG4gICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgb24sXG4gICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUpLFxuICAgICAgICBleHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUpXG4gICAgICB9LFxuICAgICAgQUNhc2NhZGVyOiB7XG4gICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgcmVuZGVyQ2VsbCAoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGdldENlbGxMYWJlbFZOcyhoLCByZW5kZXJPcHRzLCBwYXJhbXMsIGdldENhc2NhZGVyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpLFxuICAgICAgICBleHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSlcbiAgICAgIH0sXG4gICAgICBBRGF0ZVBpY2tlcjoge1xuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKSxcbiAgICAgICAgZXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJylcbiAgICAgIH0sXG4gICAgICBBTW9udGhQaWNrZXI6IHtcbiAgICAgICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXG4gICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJyksXG4gICAgICAgIGV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpXG4gICAgICB9LFxuICAgICAgQVJhbmdlUGlja2VyOiB7XG4gICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgcmVuZGVyQ2VsbCAoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGdldENlbGxMYWJlbFZOcyhoLCByZW5kZXJPcHRzLCBwYXJhbXMsIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpLFxuICAgICAgICBleHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSlcbiAgICAgIH0sXG4gICAgICBBV2Vla1BpY2tlcjoge1xuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktV1flkagnKSxcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnKSxcbiAgICAgICAgZXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJylcbiAgICAgIH0sXG4gICAgICBBVGltZVBpY2tlcjoge1xuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXG4gICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycpLFxuICAgICAgICBleHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJylcbiAgICAgIH0sXG4gICAgICBBVHJlZVNlbGVjdDoge1xuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckNlbGwgKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBnZXRDZWxsTGFiZWxWTnMoaCwgcmVuZGVyT3B0cywgcGFyYW1zLCBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSksXG4gICAgICAgIGV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpXG4gICAgICB9LFxuICAgICAgQVJhdGU6IHtcbiAgICAgICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRFeGFjdEZpbHRlck1ldGhvZCxcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcbiAgICAgIH0sXG4gICAgICBBU3dpdGNoOiB7XG4gICAgICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICByZW5kZXJGaWx0ZXIgKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcbiAgICAgICAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXG4gICAgICAgICAgY29uc3QgbmF0aXZlT24gPSBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItYW50ZC13cmFwcGVyJ1xuICAgICAgICAgICAgfSwgY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXG4gICAgICAgICAgICAgIHJldHVybiBoKG5hbWUsIHtcbiAgICAgICAgICAgICAgICBrZXk6IG9JbmRleCxcbiAgICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcbiAgICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxuICAgICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIF8uaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRFeGFjdEZpbHRlck1ldGhvZCxcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcbiAgICAgIH0sXG4gICAgICBBUmFkaW86IHtcbiAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKCksXG4gICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxuICAgICAgfSxcbiAgICAgIEFDaGVja2JveDoge1xuICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKSxcbiAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXG4gICAgICB9LFxuICAgICAgQUJ1dHRvbjoge1xuICAgICAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcbiAgICAgICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXG4gICAgICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyLFxuICAgICAgICByZW5kZXJJdGVtQ29udGVudDogZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXJcbiAgICAgIH0sXG4gICAgICBBQnV0dG9uczoge1xuICAgICAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXG4gICAgICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcbiAgICAgICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyLFxuICAgICAgICByZW5kZXJJdGVtQ29udGVudDogZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyXG4gICAgICB9XG4gICAgfSlcblxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyQXJlYXMnLCBoYW5kbGVDbGVhckV2ZW50KVxuICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUgJiYgd2luZG93LlZYRVRhYmxlLnVzZSkge1xuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcbn1cblxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXG4iLCJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscyc7XG5mdW5jdGlvbiBpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSB7XG4gICAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnO1xufVxuZnVuY3Rpb24gZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpIHtcbiAgICBsZXQgcHJvcCA9ICd2YWx1ZSc7XG4gICAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnQVN3aXRjaCc6XG4gICAgICAgICAgICBwcm9wID0gJ2NoZWNrZWQnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBwcm9wO1xufVxuZnVuY3Rpb24gZ2V0TW9kZWxFdmVudChyZW5kZXJPcHRzKSB7XG4gICAgbGV0IHR5cGUgPSAnY2hhbmdlJztcbiAgICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xuICAgICAgICBjYXNlICdBSW5wdXQnOlxuICAgICAgICAgICAgdHlwZSA9ICdjaGFuZ2UudmFsdWUnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0FSYWRpbyc6XG4gICAgICAgIGNhc2UgJ0FDaGVja2JveCc6XG4gICAgICAgICAgICB0eXBlID0gJ2lucHV0JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZTtcbn1cbmZ1bmN0aW9uIGdldENoYW5nZUV2ZW50KHJlbmRlck9wdHMpIHtcbiAgICByZXR1cm4gJ2NoYW5nZSc7XG59XG5mdW5jdGlvbiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgdmFsdWUsIGRlZmF1bHRQcm9wcykge1xuICAgIGNvbnN0IHsgdlNpemUgfSA9IHBhcmFtcy4kdGFibGU7XG4gICAgcmV0dXJuIF8uYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCB2YWx1ZSwgZGVmYXVsdFByb3BzKSB7XG4gICAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiRmb3JtO1xuICAgIHJldHVybiBfLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZm9ybWF0VGV4dChjZWxsVmFsdWUpIHtcbiAgICByZXR1cm4gJycgKyAoaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkgPyAnJyA6IGNlbGxWYWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRDZWxsTGFiZWxWTnMoaCwgcmVuZGVyT3B0cywgcGFyYW1zLCBjZWxsTGFiZWwpIHtcbiAgICBjb25zdCB7IHBsYWNlaG9sZGVyIH0gPSByZW5kZXJPcHRzO1xuICAgIHJldHVybiBbXG4gICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICBjbGFzczogJ3Z4ZS1jZWxsLS1sYWJlbCdcbiAgICAgICAgfSwgcGxhY2Vob2xkZXIgJiYgaXNFbXB0eVZhbHVlKGNlbGxMYWJlbClcbiAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndnhlLWNlbGwtLXBsYWNlaG9sZGVyJ1xuICAgICAgICAgICAgICAgIH0sIGZvcm1hdFRleHQocGxhY2Vob2xkZXIpKVxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBmb3JtYXRUZXh0KGNlbGxMYWJlbCkpXG4gICAgXTtcbn1cbmZ1bmN0aW9uIGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICBjb25zdCB7IG5hdGl2ZUV2ZW50cyB9ID0gcmVuZGVyT3B0cztcbiAgICBjb25zdCBuYXRpdmVPbnMgPSB7fTtcbiAgICBfLmVhY2gobmF0aXZlRXZlbnRzLCAoZnVuYywga2V5KSA9PiB7XG4gICAgICAgIG5hdGl2ZU9uc1trZXldID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGZ1bmMocGFyYW1zLCAuLi5hcmdzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmF0aXZlT25zO1xufVxuZnVuY3Rpb24gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgaW5wdXRGdW5jLCBjaGFuZ2VGdW5jKSB7XG4gICAgY29uc3QgeyBldmVudHMgfSA9IHJlbmRlck9wdHM7XG4gICAgY29uc3QgbW9kZWxFdmVudCA9IGdldE1vZGVsRXZlbnQocmVuZGVyT3B0cyk7XG4gICAgY29uc3QgY2hhbmdlRXZlbnQgPSBnZXRDaGFuZ2VFdmVudChyZW5kZXJPcHRzKTtcbiAgICBjb25zdCBpc1NhbWVFdmVudCA9IGNoYW5nZUV2ZW50ID09PSBtb2RlbEV2ZW50O1xuICAgIGNvbnN0IG9ucyA9IHt9O1xuICAgIF8uZWFjaChldmVudHMsIChmdW5jLCBrZXkpID0+IHtcbiAgICAgICAgb25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgZnVuYyhwYXJhbXMsIC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIGlmIChpbnB1dEZ1bmMpIHtcbiAgICAgICAgb25zW21vZGVsRXZlbnRdID0gZnVuY3Rpb24gKHRhcmdldEV2bnQpIHtcbiAgICAgICAgICAgIGlucHV0RnVuYyh0YXJnZXRFdm50KTtcbiAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW21vZGVsRXZlbnRdKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzW21vZGVsRXZlbnRdKHBhcmFtcywgdGFyZ2V0RXZudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xuICAgICAgICAgICAgICAgIGNoYW5nZUZ1bmModGFyZ2V0RXZudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICghaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xuICAgICAgICBvbnNbY2hhbmdlRXZlbnRdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNoYW5nZUZ1bmMoLi4uYXJncyk7XG4gICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1tjaGFuZ2VFdmVudF0pIHtcbiAgICAgICAgICAgICAgICBldmVudHNbY2hhbmdlRXZlbnRdKHBhcmFtcywgLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBvbnM7XG59XG5mdW5jdGlvbiBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgIGNvbnN0IHsgJHRhYmxlLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zO1xuICAgIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWUpID0+IHtcbiAgICAgICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxuICAgICAgICBfLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgdmFsdWUpO1xuICAgIH0sICgpID0+IHtcbiAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcbiAgICAgICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCBjaGFuZ2VGdW5jKSB7XG4gICAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXG4gICAgICAgIG9wdGlvbi5kYXRhID0gdmFsdWU7XG4gICAgfSwgY2hhbmdlRnVuYyk7XG59XG5mdW5jdGlvbiBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgIGNvbnN0IHsgJGZvcm0sIGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXM7XG4gICAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXG4gICAgICAgIF8uc2V0KGRhdGEsIHByb3BlcnR5LCB2YWx1ZSk7XG4gICAgfSwgKCkgPT4ge1xuICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxuICAgICAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhKGluZGV4LCBsaXN0LCB2YWx1ZXMsIGxhYmVscykge1xuICAgIGNvbnN0IHZhbCA9IHZhbHVlc1tpbmRleF07XG4gICAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgIF8uZWFjaChsaXN0LCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xuICAgICAgICAgICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpO1xuICAgICAgICAgICAgICAgIG1hdGNoQ2FzY2FkZXJEYXRhKCsraW5kZXgsIGl0ZW0uY2hpbGRyZW4sIHZhbHVlcywgbGFiZWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZm9ybWF0RGF0ZVBpY2tlcihkZWZhdWx0Rm9ybWF0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChoLCByZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIGdldENlbGxMYWJlbFZOcyhoLCByZW5kZXJPcHRzLCBwYXJhbXMsIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHM7XG4gICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zO1xuICAgIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCc7XG4gICAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJztcbiAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnO1xuICAgIGNvbnN0IGNlbGxWYWx1ZSA9IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KTtcbiAgICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3Vwc1xuICAgICAgICAgICAgPyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0SXRlbTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RJdGVtID0gXy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW0pID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0SXRlbSA9IF8uZmluZChvcHRpb25zLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZTtcbiAgICAgICAgICAgIH0pLmpvaW4oJywgJyk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgY2VsbFZhbHVlID0gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpO1xuICAgIGNvbnN0IHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXTtcbiAgICBjb25zdCBsYWJlbHMgPSBbXTtcbiAgICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscyk7XG4gICAgcmV0dXJuIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApO1xufVxuZnVuY3Rpb24gZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzO1xuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtcztcbiAgICBsZXQgY2VsbFZhbHVlID0gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpO1xuICAgIGlmIChfLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xuICAgICAgICBjZWxsVmFsdWUgPSBfLm1hcChjZWxsVmFsdWUsIChkYXRlKSA9PiBkYXRlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgJ1lZWVktTU0tREQnKSkuam9pbignIH4gJyk7XG4gICAgfVxuICAgIHJldHVybiBjZWxsVmFsdWU7XG59XG5mdW5jdGlvbiBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICBjb25zdCB7IHRyZWVEYXRhLCB0cmVlQ2hlY2thYmxlIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgY2VsbFZhbHVlID0gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpO1xuICAgIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHRyZWVDaGVja2FibGUgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUodHJlZURhdGEsIChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSwgeyBjaGlsZHJlbjogJ2NoaWxkcmVuJyB9KTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaE9iaiA/IG1hdGNoT2JqLml0ZW0udGl0bGUgOiB2YWx1ZTtcbiAgICAgICAgfSkuam9pbignLCAnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNlbGxWYWx1ZTtcbn1cbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSB7XG4gICAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzO1xuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtcztcbiAgICBsZXQgY2VsbFZhbHVlID0gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpO1xuICAgIGlmIChjZWxsVmFsdWUpIHtcbiAgICAgICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBjZWxsVmFsdWU7XG59XG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyKGRlZmF1bHRQcm9wcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtcztcbiAgICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgY29uc3QgY2VsbFZhbHVlID0gXy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcbiAgICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNlbGxWYWx1ZSwgZGVmYXVsdFByb3BzKSxcbiAgICAgICAgICAgICAgICBvbjogZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5hdGl2ZU9uOiBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgXTtcbiAgICB9O1xufVxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0cztcbiAgICByZXR1cm4gW1xuICAgICAgICBoKCdhLWJ1dHRvbicsIHtcbiAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBudWxsKSxcbiAgICAgICAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKSxcbiAgICAgICAgICAgIG5hdGl2ZU9uOiBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQpKVxuICAgIF07XG59XG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIHJlbmRlck9wdHMuY2hpbGRyZW4ubWFwKChjaGlsZFJlbmRlck9wdHMpID0+IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSk7XG59XG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIoZGVmYXVsdFByb3BzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChoLCByZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtcztcbiAgICAgICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBjbGFzczogJ3Z4ZS10YWJsZS0tZmlsdGVyLWFudGQtd3JhcHBlcidcbiAgICAgICAgICAgIH0sIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBoKG5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBvSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlLCBkZWZhdWx0UHJvcHMpLFxuICAgICAgICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsICEhb3B0aW9uLmRhdGEsIG9wdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVPbjogZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICBdO1xuICAgIH07XG59XG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgY2hlY2tlZCwgb3B0aW9uKSB7XG4gICAgY29uc3QgeyAkcGFuZWwgfSA9IHBhcmFtcztcbiAgICAkcGFuZWwuY2hhbmdlT3B0aW9uKHt9LCBjaGVja2VkLCBvcHRpb24pO1xufVxuLyoqXG4gKiDmqKHns4rljLnphY1cbiAqIEBwYXJhbSBwYXJhbXNcbiAqL1xuZnVuY3Rpb24gZGVmYXVsdEZ1enp5RmlsdGVyTWV0aG9kKHBhcmFtcykge1xuICAgIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uO1xuICAgIGNvbnN0IGNlbGxWYWx1ZSA9IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KTtcbiAgICByZXR1cm4gXy50b1N0cmluZyhjZWxsVmFsdWUpLmluZGV4T2YoZGF0YSkgPiAtMTtcbn1cbi8qKlxuICog57K+56Gu5Yy56YWNXG4gKiBAcGFyYW0gcGFyYW1zXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRFeGFjdEZpbHRlck1ldGhvZChwYXJhbXMpIHtcbiAgICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtcztcbiAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvbjtcbiAgICBjb25zdCBjZWxsVmFsdWUgPSBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG4gICAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YTtcbn1cbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpIHtcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnO1xuICAgIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSc7XG4gICAgcmV0dXJuIF8ubWFwKG9wdGlvbnMsIChpdGVtLCBvSW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdGlvbicsIHtcbiAgICAgICAgICAgIGtleTogb0luZGV4LFxuICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbVt2YWx1ZVByb3BdLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiBpdGVtLmRpc2FibGVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpIHtcbiAgICByZXR1cm4gW2Zvcm1hdFRleHQoY2VsbFZhbHVlKV07XG59XG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlcihkZWZhdWx0UHJvcHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXM7XG4gICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgY29uc3QgaXRlbVZhbHVlID0gXy5nZXQoZGF0YSwgcHJvcGVydHkpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgaChuYW1lLCB7XG4gICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSwgZGVmYXVsdFByb3BzKSxcbiAgICAgICAgICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxuICAgICAgICAgICAgICAgIG5hdGl2ZU9uOiBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgXTtcbiAgICB9O1xufVxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0cztcbiAgICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG51bGwpO1xuICAgIHJldHVybiBbXG4gICAgICAgIGgoJ2EtYnV0dG9uJywge1xuICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKSxcbiAgICAgICAgICAgIG5hdGl2ZU9uOiBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxuICAgICAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXG4gICAgXTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlcihoLCByZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0cykgPT4gZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoZGVmYXVsdEZvcm1hdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgcm93LCBjb2x1bW4sIG9wdGlvbnMgfSA9IHBhcmFtcztcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5vcmlnaW5hbCA/IF8uZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSA6IGdldERhdGVQaWNrZXJDZWxsVmFsdWUoY29sdW1uLmVkaXRSZW5kZXIgfHwgY29sdW1uLmNlbGxSZW5kZXIsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRFeHBvcnRDZWxsVmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IHJvdywgY29sdW1uLCBvcHRpb25zIH0gPSBwYXJhbXM7XG4gICAgICAgIHJldHVybiBvcHRpb25zICYmIG9wdGlvbnMub3JpZ2luYWwgPyBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSkgOiBnZXRFeHBvcnRDZWxsVmFsdWUoY29sdW1uLmVkaXRSZW5kZXIgfHwgY29sdW1uLmNlbGxSZW5kZXIsIHBhcmFtcyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zO1xuICAgICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzO1xuICAgICAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnO1xuICAgICAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnO1xuICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSBfLmdldChkYXRhLCBwcm9wZXJ0eSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBoKGAke25hbWV9R3JvdXBgLCB7XG4gICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSksXG4gICAgICAgICAgICAgICAgb246IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKSxcbiAgICAgICAgICAgICAgICBuYXRpdmVPbjogZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcbiAgICAgICAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBoKG5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBvSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogb3B0aW9uW3ZhbHVlUHJvcF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uLmRpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSk7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgXTtcbiAgICB9O1xufVxuLyoqXG4gKiDmo4Dmn6Xop6blj5HmupDmmK/lkKblsZ7kuo7nm67moIfoioLngrlcbiAqL1xuZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGNvbnRhaW5lciwgY2xhc3NOYW1lKSB7XG4gICAgbGV0IHRhcmdldEVsZW07XG4gICAgbGV0IHRhcmdldCA9IGV2bnQudGFyZ2V0O1xuICAgIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0Lm5vZGVUeXBlICYmIHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgaWYgKGNsYXNzTmFtZSAmJiB0YXJnZXQuY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUuc3BsaXQgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG4gICAgICAgICAgICB0YXJnZXRFbGVtID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRhcmdldCA9PT0gY29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgZmxhZzogZmFsc2UgfTtcbn1cbi8qKlxuICog5LqL5Lu25YW85a655oCn5aSE55CGXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQocGFyYW1zLCBlKSB7XG4gICAgY29uc3QgYm9keUVsZW0gPSBkb2N1bWVudC5ib2R5O1xuICAgIGNvbnN0IGV2bnQgPSBwYXJhbXMuJGV2ZW50IHx8IGU7XG4gICAgaWYgKFxuICAgIC8vIOS4i+aLieahhlxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XG4gICAgICAgIC8vIOe6p+iBlFxuICAgICAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XG4gICAgICAgIC8vIOaXpeacn1xuICAgICAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcbiAgICAgICAgLy8g5pe26Ze06YCJ5oupXG4gICAgICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbi8qKlxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXG4gKi9cbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XG4gICAgaW5zdGFsbCh7IGludGVyY2VwdG9yLCByZW5kZXJlciB9KSB7XG4gICAgICAgIHJlbmRlcmVyLm1peGluKHtcbiAgICAgICAgICAgIEFBdXRvQ29tcGxldGU6IHtcbiAgICAgICAgICAgICAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxuICAgICAgICAgICAgICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0RmlsdGVyTWV0aG9kOiBkZWZhdWx0RXhhY3RGaWx0ZXJNZXRob2QsXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtQ29udGVudDogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFJbnB1dDoge1xuICAgICAgICAgICAgICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXG4gICAgICAgICAgICAgICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRGdXp6eUZpbHRlck1ldGhvZCxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQUlucHV0TnVtYmVyOiB7XG4gICAgICAgICAgICAgICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXG4gICAgICAgICAgICAgICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRGdXp6eUZpbHRlck1ldGhvZCxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQVNlbGVjdDoge1xuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsVmFsdWUgPSBfLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNlbGxWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uID0gZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVPbiA9IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgXy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXAsIGdJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBnSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5jb25jYXQocmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbmRlckNlbGwoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDZWxsTGFiZWxWTnMoaCwgcmVuZGVyT3B0cywgcGFyYW1zLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJGaWx0ZXIoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlT24gPSBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Z4ZS10YWJsZS0tZmlsdGVyLWFudGQtd3JhcHBlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbkdyb3Vwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wcyA9IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogb0luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gKG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDApIDogIV8uaXNOaWwob3B0aW9uLmRhdGEpLCBvcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXRpdmVPblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBfLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogZ0luZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5jb25jYXQocmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBvSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyAob3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCkgOiAhXy5pc05pbChvcHRpb24uZGF0YSksIG9wdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBwcm9wZXJ0eSwgZmlsdGVyUmVuZGVyOiByZW5kZXJPcHRzIH0gPSBjb2x1bW47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbFZhbHVlID0gXy5nZXQocm93LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY2VsbFZhbHVlLCBkYXRhKS5sZW5ndGggPT09IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW0oaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSBfLmdldChkYXRhLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZU9uID0gZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlT25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBfLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGdJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmNvbmNhdChyZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlT25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQoaCwgcmVuZGVyT3B0cywgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0cztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSBfLmdldChkYXRhLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZU9uID0gZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlT25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBfLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGdJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdzcGFuJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmNvbmNhdChyZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0aXZlT25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSksXG4gICAgICAgICAgICAgICAgZXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFDYXNjYWRlcjoge1xuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJDZWxsKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2VsbExhYmVsVk5zKGgsIHJlbmRlck9wdHMsIHBhcmFtcywgZ2V0Q2FzY2FkZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSksXG4gICAgICAgICAgICAgICAgZXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQURhdGVQaWNrZXI6IHtcbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgICAgICAgICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpLFxuICAgICAgICAgICAgICAgIGV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQU1vbnRoUGlja2VyOiB7XG4gICAgICAgICAgICAgICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0nKSxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKSxcbiAgICAgICAgICAgICAgICBleHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFSYW5nZVBpY2tlcjoge1xuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJDZWxsKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2VsbExhYmVsVk5zKGgsIHJlbmRlck9wdHMsIHBhcmFtcywgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSksXG4gICAgICAgICAgICAgICAgZXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQVdlZWtQaWNrZXI6IHtcbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXG4gICAgICAgICAgICAgICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpLFxuICAgICAgICAgICAgICAgIGV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQVRpbWVQaWNrZXI6IHtcbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignSEg6bW06c3MnKSxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJyksXG4gICAgICAgICAgICAgICAgZXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQVRyZWVTZWxlY3Q6IHtcbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyQ2VsbChoLCByZW5kZXJPcHRzLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENlbGxMYWJlbFZOcyhoLCByZW5kZXJPcHRzLCBwYXJhbXMsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKSxcbiAgICAgICAgICAgICAgICBleHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFSYXRlOiB7XG4gICAgICAgICAgICAgICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRFeGFjdEZpbHRlck1ldGhvZCxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQVN3aXRjaDoge1xuICAgICAgICAgICAgICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVyRmlsdGVyKGgsIHJlbmRlck9wdHMsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVPbiA9IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAgaCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItYW50ZC13cmFwcGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgobmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IG9JbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIF8uaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdGl2ZU9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IGRlZmF1bHRFeGFjdEZpbHRlck1ldGhvZCxcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQVJhZGlvOiB7XG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQUNoZWNrYm94OiB7XG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKCksXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxuICAgICAgICAgICAgICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyLFxuICAgICAgICAgICAgICAgIHJlbmRlckl0ZW1Db250ZW50OiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFCdXR0b25zOiB7XG4gICAgICAgICAgICAgICAgcmVuZGVyRWRpdDogZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyLFxuICAgICAgICAgICAgICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcbiAgICAgICAgICAgICAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIsXG4gICAgICAgICAgICAgICAgcmVuZGVySXRlbUNvbnRlbnQ6IGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckZpbHRlcicsIGhhbmRsZUNsZWFyRXZlbnQpO1xuICAgICAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyQWN0aXZlZCcsIGhhbmRsZUNsZWFyRXZlbnQpO1xuICAgICAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyQXJlYXMnLCBoYW5kbGVDbGVhckV2ZW50KTtcbiAgICB9XG59O1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSAmJiB3aW5kb3cuVlhFVGFibGUudXNlKSB7XG4gICAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpbkFudGQpO1xufVxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkO1xuIl19
