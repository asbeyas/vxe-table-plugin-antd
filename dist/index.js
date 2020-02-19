(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-antd", ["exports", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.XEUtils);
    global.VXETablePluginAntd = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginAntd = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function isEmptyValue(cellValue) {
    return cellValue === null || cellValue === undefined || cellValue === '';
  }

  function matchCascaderData(index, list, values, labels) {
    var val = values[index];

    if (list && values.length > index) {
      _xeUtils["default"].each(list, function (item) {
        if (item.value === val) {
          labels.push(item.label);
          matchCascaderData(++index, item.children, values, labels);
        }
      });
    }
  }

  function formatDatePicker(defaultFormat) {
    return function (h, renderOpts, params) {
      return cellText(h, getDatePickerCellValue(renderOpts, params, defaultFormat));
    };
  }

  function getProps(_ref, _ref2, defaultProps) {
    var $table = _ref.$table;
    var props = _ref2.props;
    return _xeUtils["default"].assign($table.vSize ? {
      size: $table.vSize
    } : {}, defaultProps, props);
  }

  function getCellEvents(renderOpts, params) {
    var name = renderOpts.name,
        events = renderOpts.events;
    var $table = params.$table;
    var type = 'change';

    switch (name) {
      case 'AAutoComplete':
        type = 'select';
        break;

      case 'AInput':
        type = 'input';
        break;

      case 'AInputNumber':
        type = 'change';
        break;
    }

    var on = _defineProperty({}, type, function (evnt) {
      $table.updateStatus(params);

      if (events && events[type]) {
        events[type](params, evnt);
      }
    });

    if (events) {
      return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          cb.apply(null, [params].concat.apply(params, args));
        };
      }), on);
    }

    return on;
  }

  function getSelectCellValue(renderOpts, params) {
    var options = renderOpts.options,
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

    var cellValue = _xeUtils["default"].get(row, column.property);

    if (!isEmptyValue(cellValue)) {
      return _xeUtils["default"].map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
        var selectItem;

        for (var index = 0; index < optionGroups.length; index++) {
          selectItem = _xeUtils["default"].find(optionGroups[index][groupOptions], function (item) {
            return item[valueProp] === value;
          });

          if (selectItem) {
            break;
          }
        }

        return selectItem ? selectItem[labelProp] : value;
      } : function (value) {
        var selectItem = _xeUtils["default"].find(options, function (item) {
          return item[valueProp] === value;
        });

        return selectItem ? selectItem[labelProp] : value;
      }).join(';');
    }

    return null;
  }

  function getCascaderCellValue(renderOpts, params) {
    var _renderOpts$props2 = renderOpts.props,
        props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;
    var row = params.row,
        column = params.column;

    var cellValue = _xeUtils["default"].get(row, column.property);

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

    var cellValue = _xeUtils["default"].get(row, column.property);

    if (cellValue) {
      cellValue = _xeUtils["default"].map(cellValue, function (date) {
        return date.format(props.format || 'YYYY-MM-DD');
      }).join(' ~ ');
    }

    return cellValue;
  }

  function getTreeSelectCellValue(renderOpts, params) {
    var _renderOpts$props4 = renderOpts.props,
        props = _renderOpts$props4 === void 0 ? {} : _renderOpts$props4;
    var row = params.row,
        column = params.column;

    var cellValue = _xeUtils["default"].get(row, column.property);

    if (cellValue && (props.treeCheckable || props.multiple)) {
      cellValue = cellValue.join(';');
    }

    return cellValue;
  }

  function getDatePickerCellValue(renderOpts, params, defaultFormat) {
    var _renderOpts$props5 = renderOpts.props,
        props = _renderOpts$props5 === void 0 ? {} : _renderOpts$props5;
    var row = params.row,
        column = params.column;

    var cellValue = _xeUtils["default"].get(row, column.property);

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
      var props = getProps(params, renderOpts, defaultProps);
      return [h(renderOpts.name, {
        props: props,
        attrs: attrs,
        model: {
          value: _xeUtils["default"].get(row, column.property),
          callback: function callback(value) {
            _xeUtils["default"].set(row, column.property, value);
          }
        },
        on: getCellEvents(renderOpts, params)
      })];
    };
  }

  function getFilterEvents(on, renderOpts, params, context) {
    var events = renderOpts.events;

    if (events) {
      return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          params = Object.assign({
            context: context
          }, params);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          cb.apply(null, [params].concat.apply(params, args));
        };
      }), on);
    }

    return on;
  }

  function createFilterRender(defaultProps) {
    return function (h, renderOpts, params, context) {
      var column = params.column;
      var name = renderOpts.name,
          attrs = renderOpts.attrs,
          events = renderOpts.events;
      var props = getProps(params, renderOpts);
      var type = 'change';

      switch (name) {
        case 'AAutoComplete':
          type = 'select';
          break;

        case 'AInput':
          type = 'input';
          break;

        case 'AInputNumber':
          type = 'change';
          break;
      }

      return column.filters.map(function (item) {
        return h(name, {
          props: props,
          attrs: attrs,
          model: {
            value: item.data,
            callback: function callback(optionValue) {
              item.data = optionValue;
            }
          },
          on: getFilterEvents(_defineProperty({}, type, function (evnt) {
            handleConfirmFilter(context, column, !!item.data, item);

            if (events && events[type]) {
              events[type](Object.assign({
                context: context
              }, params), evnt);
            }
          }), renderOpts, params, context)
        });
      });
    };
  }

  function handleConfirmFilter(context, column, checked, item) {
    context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
  }

  function defaultFilterMethod(_ref3) {
    var option = _ref3.option,
        row = _ref3.row,
        column = _ref3.column;
    var data = option.data;

    var cellValue = _xeUtils["default"].get(row, column.property);
    /* eslint-disable eqeqeq */


    return cellValue === data;
  }

  function renderOptions(h, options, optionProps) {
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    var disabledProp = optionProps.disabled || 'disabled';
    return _xeUtils["default"].map(options, function (item, index) {
      return h('a-select-option', {
        props: {
          value: item[valueProp],
          disabled: item[disabledProp]
        },
        key: index
      }, item[labelProp]);
    });
  }

  function cellText(h, cellValue) {
    return ['' + (isEmptyValue(cellValue) ? '' : cellValue)];
  }

  function createFormItemRender(defaultProps) {
    return function (h, renderOpts, params, context) {
      var data = params.data,
          property = params.property;
      var name = renderOpts.name;
      var attrs = renderOpts.attrs;
      var props = getFormProps(context, renderOpts, defaultProps);
      return [h(name, {
        attrs: attrs,
        props: props,
        model: {
          value: _xeUtils["default"].get(data, property),
          callback: function callback(value) {
            _xeUtils["default"].set(data, property, value);
          }
        },
        on: getFormEvents(renderOpts, params, context)
      })];
    };
  }

  function getFormProps(_ref4, _ref5, defaultProps) {
    var $form = _ref4.$form;
    var props = _ref5.props;
    return _xeUtils["default"].assign($form.vSize ? {
      size: $form.vSize
    } : {}, defaultProps, props);
  }

  function getFormEvents(renderOpts, params, context) {
    var events = renderOpts.events;
    var $form = params.$form;
    var type = 'change';

    switch (name) {
      case 'AAutoComplete':
        type = 'select';
        break;

      case 'AInput':
        type = 'input';
        break;

      case 'AInputNumber':
        type = 'change';
        break;
    }

    var on = _defineProperty({}, type, function (evnt) {
      $form.updateStatus(params);

      if (events && events[type]) {
        events[type](params, evnt);
      }
    });

    if (events) {
      return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          cb.apply(null, [params].concat.apply(params, args));
        };
      }), on);
    }

    return on;
  }

  function createDatePickerExportMethod(defaultFormat, isEdit) {
    var renderProperty = isEdit ? 'editRender' : 'cellRender';
    return function (params) {
      return getDatePickerCellValue(params.column[renderProperty], params, defaultFormat);
    };
  }

  function createExportMethod(valueMethod, isEdit) {
    var renderProperty = isEdit ? 'editRender' : 'cellRender';
    return function (params) {
      return valueMethod(params.column[renderProperty], params);
    };
  }

  function createFormItemRadioAndCheckboxRender() {
    return function (h, renderOpts, params, context) {
      var name = renderOpts.name,
          options = renderOpts.options,
          _renderOpts$optionPro2 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2;
      var data = params.data,
          property = params.property;
      var attrs = renderOpts.attrs;
      var props = getFormProps(context, renderOpts);
      var labelProp = optionProps.label || 'label';
      var valueProp = optionProps.value || 'value';
      var disabledProp = optionProps.disabled || 'disabled';
      return [h("".concat(name, "Group"), {
        props: props,
        attrs: attrs,
        model: {
          value: _xeUtils["default"].get(data, property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(data, property, cellValue);
          }
        },
        on: getFormEvents(renderOpts, params, context)
      }, options.map(function (option) {
        return h(name, {
          props: {
            value: option[valueProp],
            disabled: option[disabledProp]
          }
        }, option[labelProp]);
      }))];
    };
  }
  /**
   * 渲染函数
   */


  var renderMap = {
    AAutoComplete: {
      autofocus: 'input.ant-input',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    AInput: {
      autofocus: 'input.ant-input',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    AInputNumber: {
      autofocus: 'input.ant-input-number-input',
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    ASelect: {
      renderEdit: function renderEdit(h, renderOpts, params) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _renderOpts$optionPro3 = renderOpts.optionProps,
            optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
            _renderOpts$optionGro2 = renderOpts.optionGroupProps,
            optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
        var row = params.row,
            column = params.column;
        var attrs = renderOpts.attrs;
        var props = getProps(params, renderOpts);

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return [h('a-select', {
            props: props,
            attrs: attrs,
            model: {
              value: _xeUtils["default"].get(row, column.property),
              callback: function callback(cellValue) {
                _xeUtils["default"].set(row, column.property, cellValue);
              }
            },
            on: getCellEvents(renderOpts, params)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
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
          model: {
            value: _xeUtils["default"].get(row, column.property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(row, column.property, cellValue);
            }
          },
          on: getCellEvents(renderOpts, params)
        }, renderOptions(h, options, optionProps))];
      },
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getSelectCellValue(renderOpts, params));
      },
      renderFilter: function renderFilter(h, renderOpts, params, context) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _renderOpts$optionPro4 = renderOpts.optionProps,
            optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
            _renderOpts$optionGro3 = renderOpts.optionGroupProps,
            optionGroupProps = _renderOpts$optionGro3 === void 0 ? {} : _renderOpts$optionGro3;
        var column = params.column;
        var attrs = renderOpts.attrs,
            events = renderOpts.events;
        var props = getProps(params, renderOpts);
        var type = 'change';

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return column.filters.map(function (item) {
            return h('a-select', {
              props: props,
              attrs: attrs,
              model: {
                value: item.data,
                callback: function callback(optionValue) {
                  item.data = optionValue;
                }
              },
              on: getFilterEvents(_defineProperty({}, type, function (value) {
                handleConfirmFilter(context, column, value && value.length > 0, item);

                if (events && events[type]) {
                  events[type](Object.assign({
                    context: context
                  }, params), value);
                }
              }), renderOpts, params, context)
            }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
              return h('a-select-opt-group', {
                key: gIndex
              }, [h('span', {
                slot: 'label'
              }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
            }));
          });
        }

        return column.filters.map(function (item) {
          return h('a-select', {
            props: props,
            attrs: attrs,
            model: {
              value: item.data,
              callback: function callback(optionValue) {
                item.data = optionValue;
              }
            },
            on: getFilterEvents({
              change: function change(value) {
                handleConfirmFilter(context, column, value && value.length > 0, item);

                if (events && events[type]) {
                  events[type](Object.assign({
                    context: context
                  }, params), value);
                }
              }
            }, renderOpts, params, context)
          }, renderOptions(h, options, optionProps));
        });
      },
      filterMethod: function filterMethod(_ref6) {
        var option = _ref6.option,
            row = _ref6.row,
            column = _ref6.column;
        var data = option.data;
        var property = column.property,
            renderOpts = column.filterRender;
        var _renderOpts$props6 = renderOpts.props,
            props = _renderOpts$props6 === void 0 ? {} : _renderOpts$props6;

        var cellValue = _xeUtils["default"].get(row, property);

        if (props.mode === 'multiple') {
          if (_xeUtils["default"].isArray(cellValue)) {
            return _xeUtils["default"].includeArrays(cellValue, data);
          }

          return data.indexOf(cellValue) > -1;
        }
        /* eslint-disable eqeqeq */


        return cellValue == data;
      },
      renderItem: function renderItem(h, renderOpts, params, context) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _renderOpts$optionPro5 = renderOpts.optionProps,
            optionProps = _renderOpts$optionPro5 === void 0 ? {} : _renderOpts$optionPro5,
            _renderOpts$optionGro4 = renderOpts.optionGroupProps,
            optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
        var data = params.data,
            property = params.property;
        var attrs = renderOpts.attrs;
        var props = getFormProps(context, renderOpts);

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return [h('a-select', {
            props: props,
            attrs: attrs,
            model: {
              value: _xeUtils["default"].get(data, property),
              callback: function callback(cellValue) {
                _xeUtils["default"].set(data, property, cellValue);
              }
            },
            on: getFormEvents(renderOpts, params, context)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
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
          model: {
            value: _xeUtils["default"].get(data, property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(data, property, cellValue);
            }
          },
          on: getFormEvents(renderOpts, params, context)
        }, renderOptions(h, options, optionProps))];
      },
      cellExportMethod: createExportMethod(getSelectCellValue),
      editCellExportMethod: createExportMethod(getSelectCellValue, true)
    },
    ACascader: {
      renderEdit: createEditRender(),
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getCascaderCellValue(renderOpts, params));
      },
      renderItem: createFormItemRender(),
      cellExportMethod: createExportMethod(getCascaderCellValue),
      editCellExportMethod: createExportMethod(getCascaderCellValue, true)
    },
    ADatePicker: {
      renderEdit: createEditRender(),
      renderCell: formatDatePicker('YYYY-MM-DD'),
      renderItem: createFormItemRender(),
      cellExportMethod: createDatePickerExportMethod('YYYY-MM-DD'),
      editCellExportMethod: createDatePickerExportMethod('YYYY-MM-DD', true)
    },
    AMonthPicker: {
      renderEdit: createEditRender(),
      renderCell: formatDatePicker('YYYY-MM'),
      renderItem: createFormItemRender(),
      cellExportMethod: createDatePickerExportMethod('YYYY-MM'),
      editCellExportMethod: createDatePickerExportMethod('YYYY-MM', true)
    },
    ARangePicker: {
      renderEdit: createEditRender(),
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getRangePickerCellValue(renderOpts, params));
      },
      renderItem: createFormItemRender(),
      cellExportMethod: createExportMethod(getRangePickerCellValue),
      editCellExportMethod: createExportMethod(getRangePickerCellValue, true)
    },
    AWeekPicker: {
      renderEdit: createEditRender(),
      renderCell: formatDatePicker('YYYY-WW周'),
      renderItem: createFormItemRender(),
      cellExportMethod: createDatePickerExportMethod('YYYY-WW周'),
      editCellExportMethod: createDatePickerExportMethod('YYYY-WW周', true)
    },
    ATimePicker: {
      renderEdit: createEditRender(),
      renderCell: formatDatePicker('HH:mm:ss'),
      renderItem: createFormItemRender(),
      cellExportMethod: createDatePickerExportMethod('HH:mm:ss'),
      editCellExportMethod: createDatePickerExportMethod('HH:mm:ss', true)
    },
    ATreeSelect: {
      renderEdit: createEditRender(),
      renderCell: function renderCell(h, renderOpts, params) {
        return cellText(h, getTreeSelectCellValue(renderOpts, params));
      },
      renderItem: createFormItemRender(),
      cellExportMethod: createExportMethod(getTreeSelectCellValue),
      editCellExportMethod: createExportMethod(getTreeSelectCellValue, true)
    },
    ARate: {
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    ASwitch: {
      renderDefault: createEditRender(),
      renderEdit: createEditRender(),
      renderFilter: createFilterRender(),
      filterMethod: defaultFilterMethod,
      renderItem: createFormItemRender()
    },
    ARadio: {
      renderItem: createFormItemRadioAndCheckboxRender()
    },
    ACheckbox: {
      renderItem: createFormItemRadioAndCheckboxRender()
    }
  };
  /**
   * 事件兼容性处理
   */

  function handleClearEvent(params, evnt, context) {
    var getEventTargetNode = context.getEventTargetNode;
    var bodyElem = document.body;

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
    install: function install(xtable) {
      var interceptor = xtable.interceptor,
          renderer = xtable.renderer;
      renderer.mixin(renderMap);
      interceptor.add('event.clearFilter', handleClearEvent);
      interceptor.add('event.clearActived', handleClearEvent);
    }
  };
  _exports.VXETablePluginAntd = VXETablePluginAntd;

  function toMomentString(cellValue, format) {
    return cellValue ? cellValue.format(format) : '';
  }

  _xeUtils["default"].mixin({
    toMomentString: toMomentString
  });

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginAntd);
  }

  var _default = VXETablePluginAntd;
  _exports["default"] = _default;
});