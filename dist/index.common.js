"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  return function (h, _ref, params) {
    var _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props;
    var row = params.row,
        column = params.column;

    var cellValue = _xeUtils["default"].get(row, column.property);

    if (cellValue) {
      cellValue = cellValue.format(props.format || defaultFormat);
    }

    return cellText(h, cellValue);
  };
}

function getEvents(editRender, params) {
  var name = editRender.name,
      events = editRender.events;
  var $table = params.$table;
  var type = 'change';

  switch (name) {
    case 'AAutoComplete':
      type = 'select';
      break;

    case 'AInput':
    case 'AInputNumber':
      type = 'input';
      break;
  }

  var on = _defineProperty({}, type, function () {
    return $table.updateStatus(params);
  });

  if (events) {
    Object.assign(on, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        cb.apply(null, [params].concat.apply(params, arguments));
      };
    }));
  }

  return on;
}

function defaultRender(h, editRender, params) {
  var $table = params.$table,
      row = params.row,
      column = params.column;
  var props = editRender.props;

  if ($table.size) {
    props = Object.assign({
      size: $table.size
    }, props);
  }

  return [h(editRender.name, {
    props: props,
    model: {
      value: _xeUtils["default"].get(row, column.property),
      callback: function callback(value) {
        _xeUtils["default"].set(row, column.property, value);
      }
    },
    on: getEvents(editRender, params)
  })];
}

function cellText(h, cellValue) {
  return ['' + (cellValue === null || cellValue === void 0 ? '' : cellValue)];
}

var renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderEdit: defaultRender
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderEdit: defaultRender
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderEdit: defaultRender
  },
  ASelect: {
    renderEdit: function renderEdit(h, editRender, params) {
      var options = editRender.options,
          optionGroups = editRender.optionGroups,
          _editRender$props = editRender.props,
          props = _editRender$props === void 0 ? {} : _editRender$props,
          _editRender$optionPro = editRender.optionProps,
          optionProps = _editRender$optionPro === void 0 ? {} : _editRender$optionPro,
          _editRender$optionGro = editRender.optionGroupProps,
          optionGroupProps = _editRender$optionGro === void 0 ? {} : _editRender$optionGro;
      var $table = params.$table,
          row = params.row,
          column = params.column;
      var labelProp = optionProps.label || 'label';
      var valueProp = optionProps.value || 'value';

      if ($table.size) {
        props = _xeUtils["default"].assign({
          size: $table.size
        }, props);
      }

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          model: {
            value: _xeUtils["default"].get(row, column.property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(row, column.property, cellValue);
            }
          },
          on: getEvents(editRender, params)
        }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
          return h('a-select-opt-group', {
            key: gIndex
          }, [h('span', {
            slot: 'label'
          }, group[groupLabel])].concat(_xeUtils["default"].map(group[groupOptions], function (item, index) {
            return h('a-select-option', {
              props: {
                value: item[valueProp]
              },
              key: index
            }, item[labelProp]);
          })));
        }))];
      }

      return [h('a-select', {
        props: props,
        model: {
          value: _xeUtils["default"].get(row, column.property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(row, column.property, cellValue);
          }
        },
        on: getEvents(editRender, params)
      }, _xeUtils["default"].map(options, function (item, index) {
        return h('a-select-option', {
          props: {
            value: item[valueProp]
          },
          key: index
        }, item[labelProp]);
      }))];
    },
    renderCell: function renderCell(h, editRender, params) {
      var options = editRender.options,
          optionGroups = editRender.optionGroups,
          _editRender$props2 = editRender.props,
          props = _editRender$props2 === void 0 ? {} : _editRender$props2,
          _editRender$optionPro2 = editRender.optionProps,
          optionProps = _editRender$optionPro2 === void 0 ? {} : _editRender$optionPro2,
          _editRender$optionGro2 = editRender.optionGroupProps,
          optionGroupProps = _editRender$optionGro2 === void 0 ? {} : _editRender$optionGro2;
      var row = params.row,
          column = params.column;
      var labelProp = optionProps.label || 'label';
      var valueProp = optionProps.value || 'value';
      var groupOptions = optionGroupProps.options || 'options';

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (!(cellValue === null || cellValue === undefined || cellValue === '')) {
        return cellText(h, _xeUtils["default"].map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
          var selectItem;

          for (var index = 0; index < optionGroups.length; index++) {
            selectItem = _xeUtils["default"].find(optionGroups[index][groupOptions], function (item) {
              return item[valueProp] === value;
            });

            if (selectItem) {
              break;
            }
          }

          return selectItem ? selectItem[labelProp] : null;
        } : function (value) {
          var selectItem = _xeUtils["default"].find(options, function (item) {
            return item[valueProp] === value;
          });

          return selectItem ? selectItem[labelProp] : null;
        }).join(';'));
      }

      return cellText(h, '');
    }
  },
  ACascader: {
    renderEdit: defaultRender,
    renderCell: function renderCell(h, _ref2, params) {
      var _ref2$props = _ref2.props,
          props = _ref2$props === void 0 ? {} : _ref2$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      var values = cellValue || [];
      var labels = [];
      matchCascaderData(0, props.options, values, labels);
      return cellText(h, (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" ".concat(props.separator || '/', " ")));
    }
  },
  ADatePicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: defaultRender,
    renderCell: function renderCell(h, _ref3, params) {
      var _ref3$props = _ref3.props,
          props = _ref3$props === void 0 ? {} : _ref3$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (cellValue) {
        cellValue = cellValue.map(function (date) {
          return date.format(props.format || 'YYYY-MM-DD');
        }).join(' ~ ');
      }

      return cellText(h, cellValue);
    }
  },
  AWeekPicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('HH:mm:ss')
  },
  ATreeSelect: {
    renderEdit: defaultRender,
    renderCell: function renderCell(h, _ref4, params) {
      var _ref4$props = _ref4.props,
          props = _ref4$props === void 0 ? {} : _ref4$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (cellValue && (props.treeCheckable || props.multiple)) {
        cellValue = cellValue.join(';');
      }

      return cellText(h, cellValue);
    }
  },
  ARate: {
    renderEdit: defaultRender
  },
  ASwitch: {
    renderEdit: defaultRender
  }
};

function hasClass(elem, cls) {
  return elem && elem.className && elem.className.split && elem.className.split(' ').indexOf(cls) > -1;
}

function getEventTargetNode(evnt, container, queryCls) {
  var targetElem;
  var target = evnt.target;

  while (target && target.nodeType && target !== document) {
    if (queryCls && hasClass(target, queryCls)) {
      targetElem = target;
    } else if (target === container) {
      return {
        flag: queryCls ? !!targetElem : true,
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


function handleClearActivedEvent(params, evnt) {
  if ( // 下拉框
  getEventTargetNode(evnt, document.body, 'ant-select-dropdown').flag || // 级联
  getEventTargetNode(evnt, document.body, 'ant-cascader-menus').flag || // 日期
  getEventTargetNode(evnt, document.body, 'ant-calendar-picker-container').flag || // 时间选择
  getEventTargetNode(evnt, document.body, 'ant-time-picker-panel').flag) {
    return false;
  }
}

function VXETablePluginAntd() {}

VXETablePluginAntd.install = function (_ref5) {
  var interceptor = _ref5.interceptor,
      renderer = _ref5.renderer;
  // 添加到渲染器
  renderer.mixin(renderMap); // 处理事件冲突

  interceptor.add('event.clear_actived', handleClearActivedEvent);
};

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd);
}

var _default = VXETablePluginAntd;
exports["default"] = _default;