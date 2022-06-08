function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-antd", ["exports", "lodash", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("lodash"), require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash, global.XEUtils);
    global.VXETablePluginAntd = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginAntd = void 0;
  _ = _interopRequireWildcard(_);
  _xeUtils = _interopRequireDefault(_xeUtils);

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
  _exports.VXETablePluginAntd = VXETablePluginAntd;

  if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
    window.VXETable.use(VXETablePluginAntd);
  }

  var _default = VXETablePluginAntd;
  _exports["default"] = _default;
});