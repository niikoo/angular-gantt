(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('lodash'), require('rxjs/Observable')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'lodash', 'rxjs/Observable'], factory) :
	(factory((global['ngx-gantt'] = {}),global.core,global.common,global.lodash,global.Observable));
}(this, (function (exports,core,common,lodash,Observable) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttConfig = (function () {
    function GanttConfig() {
        this.cellWidth = 76;
        this.rowHeight = 25;
        this.activityHeight = 300;
        this.barHeight = 20;
        this.barLineHeight = 20;
        this.barMoveable = true;
        this.barResizeable = false;
    }
    GanttConfig.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    GanttConfig.ctorParameters = function () { return []; };
    return GanttConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GroupByPipe = (function () {
    function GroupByPipe() {
    }
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    GroupByPipe.prototype.transform = /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    function (value, args) {
        var /** @type {?} */ groups = {};
        value.forEach(function (o) {
            var /** @type {?} */ group = JSON.stringify(args(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    };
    GroupByPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: 'groupBy'
                },] },
    ];
    /** @nocollapse */
    GroupByPipe.ctorParameters = function () { return []; };
    return GroupByPipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttService = (function () {
    function GanttService() {
        this.rowHeight = 0;
        this.hourCellWidth = 60;
        this.hoursCellWidth = this.hourCellWidth * 25;
        this.cellWidth = 0;
        this.windowInnerWidth = 0;
        this.activityHeight = 0;
        this.barHeight = 0;
        this.barLineHeight = 0;
        this.barTop = 0;
        this.barMoveable = false;
        this.barResizeable = false;
        this.gridWidth = 560;
        this.barStyles = [
            { status: 'information', backgroundColor: 'rgb(18,195, 244)', border: '1px solid #2196F3', progressBackgroundColor: '#2196F3' },
            { status: 'warning', backgroundColor: '#FFA726', border: '1px solid #EF6C00', progressBackgroundColor: '#EF6C00' },
            { status: 'error', backgroundColor: '#EF5350', border: '1px solid #C62828', progressBackgroundColor: '#C62828' },
            { status: 'completed', backgroundColor: '#66BB6A', border: '1px solid #2E7D32', progressBackgroundColor: '#2E7D32' }
        ];
        var /** @type {?} */ _ganttConfig = new GanttConfig();
        this.rowHeight = _ganttConfig.rowHeight;
        this.cellWidth = _ganttConfig.cellWidth;
        this.activityHeight = _ganttConfig.activityHeight;
        this.barHeight = _ganttConfig.barHeight;
        this.barLineHeight = _ganttConfig.barLineHeight;
        this.barTop = _ganttConfig.rowHeight;
        this.barMoveable = _ganttConfig.barMoveable;
        this.barResizeable = _ganttConfig.barResizeable;
    }
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} hours
     * @return {?}
     */
    GanttService.prototype.calculateBarWidth = /**
     * @param {?} start
     * @param {?} end
     * @param {?=} hours
     * @return {?}
     */
    function (start, end, hours) {
        if (typeof start === 'string') {
            start = new Date(start);
        }
        if (typeof end === 'string') {
            end = new Date(end);
        }
        var /** @type {?} */ days = this.calculateDiffDays(start, end);
        var /** @type {?} */ width = days * this.cellWidth + days;
        if (hours) {
            width = days * this.hourCellWidth * 24 + days * 24;
        }
        return width;
    };
    /**
     * @param {?} start
     * @param {?} scale
     * @param {?=} hours
     * @return {?}
     */
    GanttService.prototype.calculateBarLeft = /**
     * @param {?} start
     * @param {?} scale
     * @param {?=} hours
     * @return {?}
     */
    function (start, scale, hours) {
        var /** @type {?} */ left = 0;
        var /** @type {?} */ hoursInDay = 24;
        if (start != null) {
            if (typeof start === 'string') {
                start = new Date();
            }
            for (var /** @type {?} */ i = 0; i < scale.length; i++) {
                if (start.getDate() === scale[i].getDate()) {
                    if (hours) {
                        left = i * hoursInDay * this.hourCellWidth + hoursInDay * i + this.calculateBarLeftDelta(start, hours);
                    }
                    else {
                        left = i * this.cellWidth + i + this.calculateBarLeftDelta(start, hours);
                    }
                    break;
                }
            }
        }
        return left;
    };
    /**
     * Calculates the height of the gantt grid, activity and vertical scroll
     * @return {?}
     */
    GanttService.prototype.calculateGanttHeight = /**
     * Calculates the height of the gantt grid, activity and vertical scroll
     * @return {?}
     */
    function () {
        return this.TASK_CACHE.length * this.rowHeight + this.rowHeight * 3 + "px";
    };
    /**
     * @param {?} start
     * @param {?=} hours
     * @return {?}
     */
    GanttService.prototype.calculateBarLeftDelta = /**
     * @param {?} start
     * @param {?=} hours
     * @return {?}
     */
    function (start, hours) {
        var /** @type {?} */ offset = 0;
        var /** @type {?} */ hoursInDay = 24;
        var /** @type {?} */ minutesInHour = 60;
        var /** @type {?} */ secondsInHour = 3600;
        var /** @type {?} */ startHours = start.getHours() + start.getMinutes() / minutesInHour + start.getSeconds() / secondsInHour;
        if (hours) {
            offset = this.hoursCellWidth / hoursInDay * startHours - startHours;
        }
        else {
            offset = this.cellWidth / hoursInDay * startHours;
        }
        return offset;
    };
    /**
     * @param {?} treePath
     * @return {?}
     */
    GanttService.prototype.isParent = /**
     * @param {?} treePath
     * @return {?}
     */
    function (treePath) {
        try {
            var /** @type {?} */ depth = treePath.split('/').length;
            if (depth === 1) {
                return true;
            }
        }
        catch (/** @type {?} */ err) {
            return false;
        }
        return false;
    };
    /**
     * @param {?} treePath
     * @return {?}
     */
    GanttService.prototype.isChild = /**
     * @param {?} treePath
     * @return {?}
     */
    function (treePath) {
        if (this.isParent(treePath)) {
            return '0px';
        }
        return '20px';
    };
    /**
     * Calculate the bar styles
     * @param {?} task
     * @param {?} index
     * @param {?} scale
     * @param {?=} hours
     * @return {?}
     */
    GanttService.prototype.calculateBar = /**
     * Calculate the bar styles
     * @param {?} task
     * @param {?} index
     * @param {?} scale
     * @param {?=} hours
     * @return {?}
     */
    function (task, index, scale, hours) {
        var /** @type {?} */ barStyle = this.getBarStyle(task.status);
        return {
            'top': this.barTop * index + 2 + 'px',
            'left': this.calculateBarLeft(task.start, scale, hours) + 'px',
            'height': this.barHeight + 'px',
            'line-height': this.barLineHeight + 'px',
            'width': this.calculateBarWidth(task.start, task.end, hours) + 'px',
            'background-color': barStyle['background-color'],
            'border': barStyle['border']
        };
    };
    /**
     * Get the bar style based on task status
     * @param {?=} taskStatus
     * @return {?}
     */
    GanttService.prototype.getBarStyle = /**
     * Get the bar style based on task status
     * @param {?=} taskStatus
     * @return {?}
     */
    function (taskStatus) {
        if (taskStatus === void 0) { taskStatus = ''; }
        var /** @type {?} */ style = {};
        try {
            taskStatus = taskStatus.toLowerCase();
        }
        catch (/** @type {?} */ err) {
            taskStatus = '';
        }
        switch (taskStatus) {
            case 'information':
                style['background-color'] = this.barStyles[0].backgroundColor;
                style['border'] = this.barStyles[0].border;
                break;
            case 'warning':
                style['background-color'] = this.barStyles[1].backgroundColor;
                style['border'] = this.barStyles[1].border;
                break;
            case 'error':
                style['background-color'] = this.barStyles[2].backgroundColor;
                style['border'] = this.barStyles[2].border;
                break;
            case 'completed':
                style['background-color'] = this.barStyles[3].backgroundColor;
                style['border'] = this.barStyles[3].border;
                break;
            default:
                style['background-color'] = 'rgb(18,195, 244)';
                style['border'] = '1px solid #2196F3';
                break;
        }
        return style;
    };
    /**
     * Get the progresss bar background colour based on task status
     * @param {?=} taskStatus
     * @return {?}
     */
    GanttService.prototype.getBarProgressStyle = /**
     * Get the progresss bar background colour based on task status
     * @param {?=} taskStatus
     * @return {?}
     */
    function (taskStatus) {
        if (taskStatus === void 0) { taskStatus = ''; }
        var /** @type {?} */ style = {};
        try {
            taskStatus = taskStatus.toLowerCase();
        }
        catch (/** @type {?} */ err) {
            taskStatus = '';
        }
        switch (taskStatus) {
            case 'information':
                style['background-color'] = this.barStyles[0].progressBackgroundColor;
                break;
            case 'warning':
                style['background-color'] = this.barStyles[1].progressBackgroundColor;
                break;
            case 'error':
                style['background-color'] = this.barStyles[2].progressBackgroundColor;
                break;
            case 'completed':
                style['background-color'] = this.barStyles[3].progressBackgroundColor;
                break;
            default:
                style['background-color'] = this.barStyles[0].progressBackgroundColor;
                break;
        }
        return style;
    };
    /**
     * Calculates the bar progress width in pixels given task percent complete
     * @param {?} width
     * @param {?} percent
     * @return {?}
     */
    GanttService.prototype.calculateBarProgress = /**
     * Calculates the bar progress width in pixels given task percent complete
     * @param {?} width
     * @param {?} percent
     * @return {?}
     */
    function (width, percent) {
        if (typeof percent === 'number') {
            if (percent > 100) {
                percent = 100;
            }
            var /** @type {?} */ progress = (width / 100) * percent - 2;
            return progress + "px";
        }
        return 0 + "px";
    };
    /**
     * Calculates the difference in two dates and returns number of days
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    GanttService.prototype.calculateDiffDays = /**
     * Calculates the difference in two dates and returns number of days
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    function (start, end) {
        try {
            var /** @type {?} */ oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds /ms
            var /** @type {?} */ diffDays = Math.abs((start.getTime() - end.getTime()) / (oneDay));
            var /** @type {?} */ days = diffDays; // don't use Math.round as it will draw an incorrect bar
            return days;
        }
        catch (/** @type {?} */ err) {
            return 0;
        }
    };
    /**
     * Calculates the difference in two dates and returns number of hours
     * @param {?} task
     * @return {?}
     */
    GanttService.prototype.calculateDuration = /**
     * Calculates the difference in two dates and returns number of hours
     * @param {?} task
     * @return {?}
     */
    function (task) {
        try {
            if (task.start != null && task.end != null) {
                var /** @type {?} */ oneHour = 60 * 60 * 1000;
                var /** @type {?} */ diffHours = (Math.abs((task.start.getTime() - task.end.getTime()) / oneHour));
                var /** @type {?} */ duration = diffHours;
                if (duration > 24) {
                    return Math.round(duration / 24) + " day(s)"; // duration in days
                }
                else if (duration > 1) {
                    return Math.round(duration) + " hr(s)"; // duration in hours
                }
                else {
                    var /** @type {?} */ minutes = duration * 60;
                    if (minutes < 1) {
                        return Math.round(minutes * 60) + " second(s)"; // duration in seconds
                    }
                    return Math.round(minutes) + " min(s)"; // duration in minutes
                }
            }
            return '';
        }
        catch (/** @type {?} */ err) {
            return '';
        }
    };
    /**
     * @param {?} tasks
     * @return {?}
     */
    GanttService.prototype.calculateTotalDuration = /**
     * @param {?} tasks
     * @return {?}
     */
    function (tasks) {
        try {
            tasks = tasks.filter(function (t) { return t.parentId === t.id; }); // only calculate total duration with parent tasks
            var /** @type {?} */ totalHours = 0;
            var /** @type {?} */ oneHour = 60 * 60 * 1000;
            for (var /** @type {?} */ i = 0; i < tasks.length; i++) {
                var /** @type {?} */ start = tasks[i].start;
                var /** @type {?} */ end = tasks[i].end;
                if (start != null && end != null) {
                    var /** @type {?} */ duration = Math.abs(tasks[i].end.getTime() - tasks[i].start.getTime()) / oneHour; // duration in hours
                    totalHours += duration;
                }
            }
            if (totalHours === 0) {
                return '';
            }
            if (totalHours > 24) {
                return Math.round(totalHours / 24) + " day(s)"; // duration in days
            }
            else if (totalHours > 1) {
                return Math.round(totalHours) + " hr(s)"; // duration in hours
            }
            else {
                var /** @type {?} */ minutes = totalHours * 60;
                if (minutes < 1) {
                    return Math.round(minutes * 60) + " second(s)"; // duration in seconds
                }
                return Math.round(minutes) + " min(s)"; // duration in minutes
            }
        }
        catch (/** @type {?} */ err) {
            return '';
        }
    };
    /** Calculate the total percentage of a group of tasks */
    /**
     * Calculate the total percentage of a group of tasks
     * @param {?} node
     * @return {?}
     */
    GanttService.prototype.calculateTotalPercentage = /**
     * Calculate the total percentage of a group of tasks
     * @param {?} node
     * @return {?}
     */
    function (node) {
        var /** @type {?} */ totalPercent = 0;
        var /** @type {?} */ children = node.children;
        if (children.length > 0) {
            children.forEach(function (child) {
                totalPercent += isNaN(child.percentComplete) ? 0 : child.percentComplete;
            });
            return Math.ceil(totalPercent / children.length);
        }
        else {
            return isNaN(node.percentComplete) ? 0 : node.percentComplete;
        }
    };
    /** Calculate the total percent of the parent task */
    /**
     * Calculate the total percent of the parent task
     * @param {?} parent
     * @param {?} tasks
     * @return {?}
     */
    GanttService.prototype.calculateParentTotalPercentage = /**
     * Calculate the total percent of the parent task
     * @param {?} parent
     * @param {?} tasks
     * @return {?}
     */
    function (parent, tasks) {
        var /** @type {?} */ children = tasks.filter(function (task) {
            return task.parentId === parent.id && task.id !== parent.id;
        }); // get only children tasks ignoring parent.
        var /** @type {?} */ totalPercent = 0;
        if (children.length > 0) {
            children.forEach(function (child) {
                totalPercent += isNaN(child.percentComplete) ? 0 : child.percentComplete;
            });
            return Math.ceil(totalPercent / children.length);
        }
        else {
            return isNaN(parent.percentComplete) ? 0 : parent.percentComplete;
        }
    };
    /**
     * Calculate the gantt scale range given the start and end date of tasks
     * @param {?=} start
     * @param {?=} end
     * @return {?}
     */
    GanttService.prototype.calculateScale = /**
     * Calculate the gantt scale range given the start and end date of tasks
     * @param {?=} start
     * @param {?=} end
     * @return {?}
     */
    function (start, end) {
        if (start === void 0) { start = new Date(); }
        if (end === void 0) { end = this.addDays(start, 7); }
        var /** @type {?} */ scale = [];
        try {
            while (start.getTime() <= end.getTime()) {
                scale.push(start);
                start = this.addDays(start, 1);
            }
            return scale;
        }
        catch (/** @type {?} */ err) {
            return scale;
        }
    };
    /**
     * Determines whether given date is a weekend
     * @param {?} date
     * @return {?}
     */
    GanttService.prototype.isDayWeekend = /**
     * Determines whether given date is a weekend
     * @param {?} date
     * @return {?}
     */
    function (date) {
        var /** @type {?} */ day = date.getDay();
        if (day === 6 || day === 0) {
            return true;
        }
        return false;
    };
    /**
     * Add x number of days to a date object
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    GanttService.prototype.addDays = /**
     * Add x number of days to a date object
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    function (date, days) {
        var /** @type {?} */ result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    /**
     * Remove x number of days from a date object
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    GanttService.prototype.removeDays = /**
     * Remove x number of days from a date object
     * @param {?} date
     * @param {?} days
     * @return {?}
     */
    function (date, days) {
        var /** @type {?} */ result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    };
    /**
     * Calculates the grid scale for gantt based on tasks start and end dates
     * @param {?} tasks
     * @return {?}
     */
    GanttService.prototype.calculateGridScale = /**
     * Calculates the grid scale for gantt based on tasks start and end dates
     * @param {?} tasks
     * @return {?}
     */
    function (tasks) {
        var /** @type {?} */ start;
        var /** @type {?} */ end;
        var /** @type {?} */ dates = tasks.map(function (task) {
            return {
                start: new Date(task.start),
                end: new Date(task.end)
            };
        });
        start = new Date(Math.min.apply(null, dates.map(function (t) {
            return t.start;
        })));
        end = new Date(Math.max.apply(null, dates.map(function (t) {
            return t.end;
        })));
        return {
            start: start,
            end: end
        };
    };
    /**
     * Create an hours array for use in time scale component
     * @param {?} cols
     * @return {?}
     */
    GanttService.prototype.getHours = /**
     * Create an hours array for use in time scale component
     * @param {?} cols
     * @return {?}
     */
    function (cols) {
        var /** @type {?} */ hours = [];
        while (hours.length <= cols * 24) {
            for (var /** @type {?} */ i = 0; i <= 23; i++) {
                if (i < 10) {
                    hours.push('0' + i.toString());
                }
                else {
                    hours.push(i.toString());
                }
            }
        }
        return hours;
    };
    /**
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    GanttService.prototype.getComputedStyle = /**
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    function (element, attribute) {
        return parseInt(document.defaultView.getComputedStyle(element)[attribute], 10);
    };
    /**
     * @return {?}
     */
    GanttService.prototype.calculateContainerWidth = /**
     * @return {?}
     */
    function () {
        this.windowInnerWidth = window.innerWidth;
        var /** @type {?} */ containerWidth = (innerWidth - 18);
        return containerWidth;
    };
    /**
     * @return {?}
     */
    GanttService.prototype.calculateActivityContainerDimensions = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ scrollWidth = 18;
        this.windowInnerWidth = window.innerWidth;
        var /** @type {?} */ width = this.windowInnerWidth - this.gridWidth - scrollWidth;
        return { height: this.activityHeight, width: width };
    };
    /**
     * Set the vertical scroll top positions for gantt
     * @param {?} verticalScrollElem
     * @param {?} ganttGridElem
     * @param {?} ganttActivityAreaElem
     * @return {?}
     */
    GanttService.prototype.scrollTop = /**
     * Set the vertical scroll top positions for gantt
     * @param {?} verticalScrollElem
     * @param {?} ganttGridElem
     * @param {?} ganttActivityAreaElem
     * @return {?}
     */
    function (verticalScrollElem, ganttGridElem, ganttActivityAreaElem) {
        var /** @type {?} */ verticalScrollTop = verticalScrollElem.scrollTop;
        var /** @type {?} */ scroll = this.setScrollTop;
        // debounce
        if (verticalScrollTop !== null && verticalScrollTop !== undefined) {
            setTimeout(function () {
                scroll(verticalScrollTop, ganttActivityAreaElem);
                scroll(ganttActivityAreaElem.scrollTop, ganttGridElem);
            }, 50);
        }
    };
    /**
     * Group data by id , only supports one level
     * @param {?} tasks
     * @return {?}
     */
    GanttService.prototype.groupData = /**
     * Group data by id , only supports one level
     * @param {?} tasks
     * @return {?}
     */
    function (tasks) {
        var /** @type {?} */ merged = [];
        var /** @type {?} */ groups = new GroupByPipe().transform(tasks, function (task) {
            return [task.treePath.split('/')[0]];
        });
        return merged.concat.apply([], groups);
    };
    /**
     * Create tree of data
     * @param {?} input
     * @return {?}
     */
    GanttService.prototype.transformData = /**
     * Create tree of data
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var /** @type {?} */ output = [];
        for (var /** @type {?} */ i = 0; i < input.length; i++) {
            var /** @type {?} */ chain = input[i].id.split('/');
            var /** @type {?} */ currentNode = output;
            for (var /** @type {?} */ j = 0; j < chain.length; j++) {
                var /** @type {?} */ wantedNode = chain[j];
                for (var /** @type {?} */ k = 0; k < currentNode.length; k++) {
                    if (currentNode[k].name === wantedNode) {
                        currentNode = currentNode[k].children;
                        break;
                    }
                }
            }
        }
        return output;
    };
    /**
     * Checks whether any new data needs to be added to task cache
     * @param {?} tasks
     * @param {?} treeExpanded
     * @return {?}
     */
    GanttService.prototype.doTaskCheck = /**
     * Checks whether any new data needs to be added to task cache
     * @param {?} tasks
     * @param {?} treeExpanded
     * @return {?}
     */
    function (tasks, treeExpanded) {
        var _this = this;
        var /** @type {?} */ cachedTaskIds = this.TASK_CACHE.map(function (task) {
            return task.id;
        });
        var /** @type {?} */ itemsToCache = [];
        if (treeExpanded) {
            // push children and parent tasks that are not cached
            tasks.filter(function (task) {
                return cachedTaskIds.indexOf(task.id) === -1;
            }).forEach(function (task) {
                itemsToCache.push(task);
            });
        }
        else {
            // only look at tasks that are not cached
            tasks.filter(function (task) {
                return cachedTaskIds.indexOf(task.id) === -1 && task.treePath.split('/').length === 1;
            }).forEach(function (task) {
                itemsToCache.push(task);
            });
        }
        itemsToCache.forEach(function (item) {
            _this.TASK_CACHE.push(item);
        });
        if (itemsToCache.length > 0) {
            return true;
        }
        return false;
    };
    /**
     * Set a id prefix so CSS3 query selector can work with ids that contain numbers
     * @param {?} id
     * @return {?}
     */
    GanttService.prototype.setIdPrefix = /**
     * Set a id prefix so CSS3 query selector can work with ids that contain numbers
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return "_" + id;
    };
    /**
     * Set the scroll top property of a native DOM element
     * @param {?} scrollTop
     * @param {?} element
     * @return {?}
     */
    GanttService.prototype.setScrollTop = /**
     * Set the scroll top property of a native DOM element
     * @param {?} scrollTop
     * @param {?} element
     * @return {?}
     */
    function (scrollTop, element) {
        if (element !== null && element !== undefined) {
            element.scrollTop = scrollTop;
        }
    };
    GanttService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    GanttService.ctorParameters = function () { return []; };
    return GanttService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @record
 */

/**
 * @record
 */

/**
 * @record
 */

/**
 * @record
 */

/** @enum {number} */
var Zooming = {
    hours: 0,
    days: 1,
};
Zooming[Zooming.hours] = "hours";
Zooming[Zooming.days] = "days";
/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttActivityComponent = (function () {
    function GanttActivityComponent(ganttService) {
        this.ganttService = ganttService;
        this._options = {};
        this.onGridRowClick = new core.EventEmitter();
        this.upTriangle = '&#x25b2;';
        this.downTriangle = '&#x25bc;';
        this.zoom = new core.EventEmitter();
        this.activityActions = {
            expanded: false,
            expandedIcon: this.downTriangle
        };
        this.zoomLevel = Zooming[Zooming.hours];
        this.treeExpanded = false;
        this.scale = {
            start: null,
            end: null
        };
        this.dimensions = {
            height: 0,
            width: 0
        };
        this.data = [];
        this.gridColumns = [
            { name: '', left: 0, width: 16 },
            { name: 'Task', left: 20, width: 330 },
            { name: '%', left: 8, width: 40 },
            { name: 'Duration', left: 14, width: 140 }
        ];
    }
    Object.defineProperty(GanttActivityComponent.prototype, "options", {
        get: /**
         * @return {?}
         */
        function () {
            return this._options;
        },
        set: /**
         * @param {?} newOptions
         * @return {?}
         */
        function (newOptions) {
            if (lodash.isNil(newOptions)) {
                return;
            }
            if (lodash.isObject(newOptions) && !lodash.isEqual(newOptions, this._options)) {
                this._options = newOptions;
                console.log('Retriggering init to set new scaling sizes');
                this.ngOnInit();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        // Cache the project data and only work with that. Only show parent tasks by default
        this.ganttService.TASK_CACHE = this.project.tasks.slice(0).filter(function (item) {
            return item.treePath.split('/').length === 1;
        });
        this.ganttService.TIME_SCALE = this.ganttService.calculateScale(this.options.scale.start, this.options.scale.end);
        this.zoomLevel = this.options.zooming;
        this.start = this.options.scale.start;
        this.end = this.options.scale.end;
        this.containerWidth = this.calculateContainerWidth();
        this.containerHeight = this.calculateContainerHeight();
        this.activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        // important that these are called last as it relies on values calculated above.
        this.setScale();
        this.setDimensions();
        this.setSizes();
        this.expand(); // default to expanded
    };
    /** Custom model check */
    /**
     * Custom model check
     * @return {?}
     */
    GanttActivityComponent.prototype.ngDoCheck = /**
     * Custom model check
     * @return {?}
     */
    function () {
        // do a check to see whether any new tasks have been added. If the task is a child then push into array if tree expanded?
        var /** @type {?} */ tasksAdded = this.ganttService.doTaskCheck(this.project.tasks, this.treeExpanded);
        // only force expand if tasks are added and tree is already expanded
        if (tasksAdded && this.activityActions.expanded) {
            this.expand(true);
        }
    };
    /** On vertical scroll set the scroll top of grid and activity  */
    /**
     * On vertical scroll set the scroll top of grid and activity
     * @param {?} verticalScroll
     * @param {?} ganttGrid
     * @param {?} ganttActivityArea
     * @return {?}
     */
    GanttActivityComponent.prototype.onVerticalScroll = /**
     * On vertical scroll set the scroll top of grid and activity
     * @param {?} verticalScroll
     * @param {?} ganttGrid
     * @param {?} ganttActivityArea
     * @return {?}
     */
    function (verticalScroll, ganttGrid, ganttActivityArea) {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    };
    /** Removes or adds children for given parent tasks back into DOM by updating TASK_CACHE */
    /**
     * Removes or adds children for given parent tasks back into DOM by updating TASK_CACHE
     * @param {?} rowElem
     * @param {?} task
     * @return {?}
     */
    GanttActivityComponent.prototype.toggleChildren = /**
     * Removes or adds children for given parent tasks back into DOM by updating TASK_CACHE
     * @param {?} rowElem
     * @param {?} task
     * @return {?}
     */
    function (rowElem, task) {
        var _this = this;
        try {
            var /** @type {?} */ isParent = 'true' === rowElem.getAttribute('data-isparent');
            var /** @type {?} */ parentId_1 = rowElem.getAttribute('data-parentid').replace('_', ''); // remove id prefix
            var /** @type {?} */ children = document.querySelectorAll('[data-parentid=' + rowElem.getAttribute('data-parentid') + '][data-isparent=false]');
            // use the task cache to allow deleting of items without polluting the project.tasks array
            if (isParent) {
                // remove children from the DOM as we don't want them if we are collapsing the parent
                if (children.length > 0) {
                    var /** @type {?} */ childrenIds = this.ganttService.TASK_CACHE.filter(function (task1) {
                        return task1.parentId === parentId_1 && task1.treePath.split('/').length > 1;
                    }).map(function (item) { return item.id; });
                    childrenIds.forEach(function (item) {
                        var /** @type {?} */ removedIndex = _this.ganttService.TASK_CACHE.map(function (item1) { return item1.id; }).indexOf(item);
                        _this.ganttService.TASK_CACHE.splice(removedIndex, 1);
                    });
                    if (this.activityActions.expanded) {
                        this.expand(true);
                    }
                }
                else {
                    // CHECK the project cache to see if this parent id has any children
                    // and if so push them back into array so DOM is updated
                    var /** @type {?} */ childrenTasks = this.project.tasks.filter(function (task1) {
                        return task1.parentId === parentId_1 && task1.treePath.split('/').length > 1;
                    });
                    childrenTasks.forEach(function (task1) {
                        _this.ganttService.TASK_CACHE.push(task1);
                    });
                    if (this.activityActions.expanded) {
                        this.expand(true);
                    }
                }
            }
            this.onGridRowClick.emit(task);
        }
        catch (/** @type {?} */ err) {
        }
    };
    /** Removes or adds children tasks back into DOM by updating TASK_CACHE */
    /**
     * Removes or adds children tasks back into DOM by updating TASK_CACHE
     * @return {?}
     */
    GanttActivityComponent.prototype.toggleAllChildren = /**
     * Removes or adds children tasks back into DOM by updating TASK_CACHE
     * @return {?}
     */
    function () {
        var _this = this;
        try {
            var /** @type {?} */ children = document.querySelectorAll('[data-isparent=false]');
            var /** @type {?} */ childrenIds_1 = Array.prototype.slice.call(children).map(function (item) {
                return item.getAttribute('data-id').replace('_', ''); // remove id prefix
            });
            // push all the children array items into cache
            if (this.treeExpanded) {
                if (children.length > 0) {
                    var /** @type {?} */ childIds = this.ganttService.TASK_CACHE.filter(function (task) {
                        return task.treePath.split('/').length > 1;
                    }).map(function (item) { return item.id; });
                    childIds.forEach(function (item) {
                        var /** @type {?} */ removedIndex = _this.ganttService.TASK_CACHE.map(function (item1) { return item1.id; }).indexOf(item);
                        _this.ganttService.TASK_CACHE.splice(removedIndex, 1);
                    });
                }
                this.treeExpanded = false;
                if (this.activityActions.expanded) {
                    this.expand(true);
                }
            }
            else {
                // get all children tasks in project input
                var /** @type {?} */ childrenTasks = this.project.tasks.filter(function (task) {
                    return task.treePath.split('/').length > 1;
                });
                if (children.length > 0) {
                    // filter out these children as they already exist in task cache
                    childrenTasks = childrenTasks.filter(function (task) {
                        return childrenIds_1.indexOf(task.id) === -1;
                    });
                }
                childrenTasks.forEach(function (task) {
                    _this.ganttService.TASK_CACHE.push(task);
                });
                this.treeExpanded = true;
                if (this.activityActions.expanded) {
                    this.expand(true);
                }
            }
        }
        catch (/** @type {?} */ err) {
        }
    };
    /** On resize of browser window dynamically adjust gantt activity height and width */
    /**
     * On resize of browser window dynamically adjust gantt activity height and width
     * @param {?} event
     * @return {?}
     */
    GanttActivityComponent.prototype.onResize = /**
     * On resize of browser window dynamically adjust gantt activity height and width
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        if (this.activityActions.expanded) {
            this.ganttActivityHeight = this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + 'px';
        }
        else {
            this.ganttActivityHeight = activityContainerSizes.height + 'px';
        }
        this.ganttActivityWidth = activityContainerSizes.width;
    };
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.setScale = /**
     * @return {?}
     */
    function () {
        this.scale.start = this.start;
        this.scale.end = this.end;
    };
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.setDimensions = /**
     * @return {?}
     */
    function () {
        this.dimensions.height = this.containerHeight;
        this.dimensions.width = this.containerWidth;
    };
    /**
     * @param {?} isParent
     * @return {?}
     */
    GanttActivityComponent.prototype.setGridRowStyle = /**
     * @param {?} isParent
     * @return {?}
     */
    function (isParent) {
        if (isParent) {
            return {
                'height': this.ganttService.rowHeight + 'px',
                'line-height': this.ganttService.rowHeight + 'px',
                'font-weight': 'bold',
                'cursor': 'pointer'
            };
        }
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px'
        };
    };
    /** Set the zoom level e.g hours, days */
    /**
     * Set the zoom level e.g hours, days
     * @param {?} level
     * @return {?}
     */
    GanttActivityComponent.prototype.zoomTasks = /**
     * Set the zoom level e.g hours, days
     * @param {?} level
     * @return {?}
     */
    function (level) {
        this.zoomLevel = level;
        this.zoom.emit(this.zoomLevel);
        this.containerWidth = this.calculateContainerWidth();
        this.setDimensions();
        document.querySelector('.gantt_activity').scrollLeft = 0; // reset scroll left, replace with @ViewChild?
    };
    /** Expand the gantt grid and activity area height */
    /**
     * Expand the gantt grid and activity area height
     * @param {?=} force
     * @return {?}
     */
    GanttActivityComponent.prototype.expand = /**
     * Expand the gantt grid and activity area height
     * @param {?=} force
     * @return {?}
     */
    function (force) {
        var /** @type {?} */ verticalScroll = document.querySelector('.gantt_vertical_scroll');
        var /** @type {?} */ ganttActivityHeight = this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + "px";
        if (force && this.activityActions.expanded) {
            this.ganttActivityHeight = ganttActivityHeight;
        }
        else if (this.activityActions.expanded) {
            this.activityActions.expanded = false;
            this.activityActions.expandedIcon = this.downTriangle;
            this.ganttActivityHeight = '300px';
        }
        else {
            verticalScroll.scrollTop = 0;
            this.activityActions.expanded = true;
            this.activityActions.expandedIcon = this.upTriangle;
            this.ganttActivityHeight = ganttActivityHeight;
        }
    };
    /** Get the status icon unicode string */
    /**
     * Get the status icon unicode string
     * @param {?} status
     * @param {?} percentComplete
     * @return {?}
     */
    GanttActivityComponent.prototype.getStatusIcon = /**
     * Get the status icon unicode string
     * @param {?} status
     * @param {?} percentComplete
     * @return {?}
     */
    function (status, percentComplete) {
        var /** @type {?} */ checkMarkIcon = '&#x2714;';
        var /** @type {?} */ upBlackPointer = '&#x25b2;';
        var /** @type {?} */ crossMarkIcon = '&#x2718;';
        if (status === 'Completed' || percentComplete === 100 && status !== 'Error') {
            return checkMarkIcon;
        }
        else if (status === 'Warning') {
            return upBlackPointer;
        }
        else if (status === 'Error') {
            return crossMarkIcon;
        }
        return '';
    };
    /** Get the status icon color */
    /**
     * Get the status icon color
     * @param {?} status
     * @param {?} percentComplete
     * @return {?}
     */
    GanttActivityComponent.prototype.getStatusIconColor = /**
     * Get the status icon color
     * @param {?} status
     * @param {?} percentComplete
     * @return {?}
     */
    function (status, percentComplete) {
        if (status === 'Completed' || percentComplete === 100 && status !== 'Error') {
            return 'green';
        }
        else if (status === 'Warning') {
            return 'orange';
        }
        else if (status === 'Error') {
            return 'red';
        }
        return '';
    };
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.setGridScaleStyle = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ height = this.ganttService.rowHeight;
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            height *= 2;
        }
        return {
            'height': height + 'px',
            'line-height': height + 'px',
            'width': this.ganttService.gridWidth + 'px'
        };
    };
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.calculateContainerHeight = /**
     * @return {?}
     */
    function () {
        return this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight;
    };
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.calculateContainerWidth = /**
     * @return {?}
     */
    function () {
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            return this.ganttService.TIME_SCALE.length * this.ganttService.hourCellWidth * 24 + this.ganttService.hourCellWidth;
        }
        else {
            return this.ganttService.TIME_SCALE.length * this.ganttService.cellWidth + this.ganttService.cellWidth;
        }
    };
    /**
     * @return {?}
     */
    GanttActivityComponent.prototype.setSizes = /**
     * @return {?}
     */
    function () {
        this.ganttActivityHeight = this.activityContainerSizes.height + 'px';
        this.ganttActivityWidth = this.activityContainerSizes.width;
    };
    GanttActivityComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-activity',
                    template: "<div class=\"actions_bar\"> <div style=\"float:right\"> <!--<label> <button (click)=\"zoomTasks('hours')\" class=\"btn btn-info\">Hour</button> </label> <label> <button (click)=\"zoomTasks('days')\" class=\"btn btn-info\">Day</button> </label>--> <button (click)=\"expand()\" style=\"background-color:whitesmoke; border:none; font-size:21px; cursor:pointer\" [innerHTML]=\"activityActions.expandedIcon\"></button> </div> </div> <div class=\"grid\" #ganttGrid [ngStyle]=\"{ 'height': ganttActivityHeight, 'width': ganttService.gridWidth + 'px'}\"> <div class=\"grid_scale\" [ngStyle]=\"setGridScaleStyle()\"> <div class=\"grid_head_cell\" *ngFor=\"let column of gridColumns\" [style.width]=\"column.width + 'px'\" [style.left]=\"column.left + 'px'\"> <label>{{column.name}} <span *ngIf=\"column.name === 'Duration'\" style=\"font-weight:bold\">{{ ganttService.calculateTotalDuration(ganttService.TASK_CACHE) }}</span></label> </div> <div class=\"grid_head_cell\"> <button (click)=\"toggleAllChildren()\" style=\"background-color:whitesmoke; border:none; font-size:21px; cursor:pointer\">{{ treeExpanded ? '&#x25b2;' : '&#x25bc;' }}</button> </div> </div> <div class=\"grid_data\" #ganttGridData [ngStyle]=\"{ 'height': ganttService.calculateGanttHeight() }\"> <div #row *ngFor=\"let data of ganttService.groupData(ganttService.TASK_CACHE)\" (click)=\"toggleChildren(row, data)\" class=\"grid_row\" [ngStyle]=\"setGridRowStyle(ganttService.isParent(data.treePath))\" [attr.data-id]=\"ganttService.setIdPrefix(data.id)\" [attr.data-isParent]=\"ganttService.isParent(data.treePath)\" [attr.data-parentid]=\"ganttService.setIdPrefix(data.parentId)\"> <div class=\"grid_cell\" [ngStyle]=\"{ 'width': gridColumns[0].width + 'px' }\"> <div [innerHTML]=\"getStatusIcon(data.status, data.percentComplete)\" [style.color]=\"getStatusIconColor(data.status, data.percentComplete)\"></div> </div> <div class=\"grid_cell\" [ngStyle]=\" { 'width': gridColumns[1].width + 'px', 'padding-left': ganttService.isChild(data.treePath) }\"> <div class=\"gantt_tree_content\">{{data.name}}</div> </div> <div class=\"grid_cell\" [ngStyle]=\"{ 'width': gridColumns[2].width + 'px' }\"> <!--<div>{{ ganttService.isParent(data.treePath) === true ? ganttService.calculateParentTotalPercentage(data, project.tasks) : data.percentComplete }}</div>--> <div>{{ data.percentComplete }}</div> </div> <div class=\"grid_cell\" [ngStyle]=\"{ 'width': gridColumns[3].width + 'px'}\"> <div> {{ ganttService.calculateDuration(data) }}</div> </div> </div> </div> </div><div class=\"gantt_activity\" (window:resize)=\"onResize($event)\" [ngStyle]=\"{ 'height': ganttActivityHeight, 'width': ganttActivityWidth - 18 + 'px'}\"> <gantt-time-scale [zoom]=\"zoom\" [zoomLevel]=\"zoomLevel\" [timeScale]=\"ganttService.TIME_SCALE\" [dimensions]=\"dimensions\"></gantt-time-scale> <div class=\"gantt_activity_area\" #ganttActivityArea [ngStyle]=\"{ 'height': ganttService.calculateGanttHeight(), 'width': containerWidth + 'px'}\"> <gantt-activity-background [zoom]=\"zoom\" [zoomLevel]=\"zoomLevel\" [timeScale]=\"ganttService.TIME_SCALE\" [tasks]=\"ganttService.TASK_CACHE\"></gantt-activity-background> <gantt-activity-bars [zoom]=\"zoom\" [zoomLevel]=\"zoomLevel\" [timeScale]=\"ganttService.TIME_SCALE\" [dimensions]=\"dimensions\" [tasks]=\"ganttService.TASK_CACHE\"></gantt-activity-bars> </div> </div> <div class=\"gantt_vertical_scroll\" #verticalScroll (scroll)=\"onVerticalScroll(verticalScroll, ganttGrid, ganttActivityArea)\" [ngStyle]=\"{'display': activityActions.expanded === true ? 'none' : 'block' }\"> <div [ngStyle]=\"{ 'height': ganttService.calculateGanttHeight() }\"></div> </div> ",
                    styles: ["/* You can add global styles to this file, and also import other style files */ .gantt_activity { /*overflow-x: hidden;*/ height: 250px; overflow-y: hidden; overflow-x: scroll; display: inline-block; vertical-align: top; position: relative; } .gantt_activity_area { position: relative; overflow-x: hidden; overflow-y: hidden; -webkit-user-select: none; } .gantt_vertical_scroll { background-color: transparent; overflow-x: hidden; overflow-y: scroll; position: absolute; right: 0; display: block; height: 283px; width: 18px; top: 70px; } .grid { overflow-x: hidden; overflow-y: hidden; display: inline-block; vertical-align: top; border-right: 1px solid #cecece; } .grid_scale { color: #6b6b6b; font-size: 12px; border-bottom: 1px solid #e0e0e0; background-color: whitesmoke; } .grid_head_cell { /*color: #a6a6a6;*/ border-top: none !important; border-right: none !important; line-height: inherit; box-sizing: border-box; display: inline-block; vertical-align: top; border-right: 1px solid #cecece; /*text-align: center;*/ position: relative; cursor: default; height: 100%; -moz-user-select: -moz-none; -webkit-user-select: none; overflow: hidden; } .grid_data { overflow: hidden; } .grid_row { box-sizing: border-box; border-bottom: 1px solid #e0e0e0; background-color: #fff; position: relative; -webkit-user-select: none; } .grid_row:hover { background-color: #eeeeee; } .grid_cell { border-right: none; color: #454545; display: inline-block; vertical-align: top; padding-left: 6px; padding-right: 6px; height: 100%; overflow: hidden; white-space: nowrap; font-size: 13px; box-sizing: border-box; } .actions_bar { /*border-top: 1px solid #cecece;*/ border-bottom: 1px solid #e0e0e0; clear: both; /*margin-top: 90px;*/ height: 28px; background: whitesmoke; color: #494949; font-family: Arial, sans-serif; font-size: 13px; padding-left: 15px; line-height: 25px; } .gantt_tree_content { padding-left: 15px; } "],
                    changeDetection: core.ChangeDetectionStrategy.Default
                },] },
    ];
    /** @nocollapse */
    GanttActivityComponent.ctorParameters = function () { return [
        { type: GanttService, },
    ]; };
    GanttActivityComponent.propDecorators = {
        "project": [{ type: core.Input },],
        "options": [{ type: core.Input },],
        "onGridRowClick": [{ type: core.Output },],
    };
    return GanttActivityComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttComponent = (function () {
    function GanttComponent(ganttService, changeDetector) {
        var _this = this;
        this.ganttService = ganttService;
        this.changeDetector = changeDetector;
        /**
         * @see https://github.com/dalestone/angular2-gantt/tree/master/src/demo-app
         */
        this._project = {
            id: '',
            name: '',
            startDate: new Date(),
            tasks: []
        };
        this._options = {
            scale: {
                start: new Date(2018, 0, 1),
                end: new Date(2019, 1, 1)
            },
            zooming: Zooming[Zooming.days]
        };
        this.projectUpdates = new core.EventEmitter();
        this.onGridRowClick = new core.EventEmitter();
        window['ganttComponent'] = this;
        this.projectUpdates.subscribe(function (s) {
            if (_this.options.scale.auto) {
                _this.scaleToTasks();
                _this.changeDetector.detectChanges();
            }
        });
    }
    Object.defineProperty(GanttComponent.prototype, "project", {
        get: /**
         * @return {?}
         */
        function () {
            return this._project;
        },
        set: /**
         * @param {?} project
         * @return {?}
         */
        function (project) {
            if (lodash.isNil(project) || lodash.isEqual(this._project, project)) {
                return;
            }
            this._project = project;
            this.projectUpdates.emit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GanttComponent.prototype, "options", {
        /*@Input()
        set options(options: any) {
          if (options.scale) {
            this._options = options;
          } else {
            // this.setDefaultOptions();
          }
        }*/
        get: /**
         * @return {?}
         */
        function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    GanttComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    GanttComponent.prototype.setSizes = /**
     * @return {?}
     */
    function () {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    };
    /**
     * @return {?}
     */
    GanttComponent.prototype.scaleToTasks = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ scale = this.ganttService.calculateGridScale(this._project.tasks);
        this._options = {
            scale: scale
        };
    };
    /**
     * @return {?}
     */
    GanttComponent.prototype.setDefaultProject = /**
     * @return {?}
     */
    function () {
        this._project = {
            id: '1',
            name: 'Sample',
            startDate: new Date(),
            tasks: []
        };
    };
    /**
     * @param {?} task
     * @return {?}
     */
    GanttComponent.prototype.gridRowClicked = /**
     * @param {?} task
     * @return {?}
     */
    function (task) {
        this.onGridRowClick.emit(task);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    GanttComponent.prototype.onResize = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        this.setSizes();
    };
    GanttComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-component',
                    template: "<div class=\"gantt-container-holder\"> <div class=\"gantt-container\" (window:resize)=\"onResize($event)\"> <gantt-header [name]=\"_project.name\" [startDate]=\"_project.startDate\"></gantt-header> <gantt-activity [project]=\"_project\" [options]=\"options\" (onGridRowClick)=\"gridRowClicked($event)\"></gantt-activity> <gantt-footer [project]=\"_project\"></gantt-footer> </div> </div> ",
                    styles: [".gantt-container-holder { width: 100%; position: relative; } .gantt-container { font-family: Arial, serif; font-size: 13px; border: 1px solid #cecece; position: relative; white-space: nowrap; margin-top: 0; } "]
                },] },
    ];
    /** @nocollapse */
    GanttComponent.ctorParameters = function () { return [
        { type: GanttService, },
        { type: core.ChangeDetectorRef, },
    ]; };
    GanttComponent.propDecorators = {
        "project": [{ type: core.Input },],
        "onGridRowClick": [{ type: core.Output },],
    };
    return GanttComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttHeaderComponent = (function () {
    function GanttHeaderComponent() {
        this.name = '';
        this.startDate = new Date();
    }
    /**
     * @return {?}
     */
    GanttHeaderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    GanttHeaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-header',
                    template: "<div class=\"gantt-header\"> <div class=\"gantt-header-title\"> <div style=\"flex:1\">{{ name }}</div> <div>Started: {{ startDate | date: 'medium'}}</div> </div> </div> ",
                    styles: [".gantt-header { background-color: whitesmoke; height: 40px; border-bottom: 1px solid #e0e0e0; } .gantt-header-title { padding: 12px; display: flex; flex-wrap:wrap; font-family: Arial, Helvetica, sans-serif; font-size: 16px; } .gantt-header-actions { display: inline; float: right; padding: 6px; } "]
                },] },
    ];
    /** @nocollapse */
    GanttHeaderComponent.ctorParameters = function () { return []; };
    GanttHeaderComponent.propDecorators = {
        "name": [{ type: core.Input },],
        "startDate": [{ type: core.Input },],
    };
    return GanttHeaderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttFooterComponent = (function () {
    function GanttFooterComponent() {
    }
    /**
     * @return {?}
     */
    GanttFooterComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    GanttFooterComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-footer',
                    template: "<div class=\"gantt-footer\"></div> ",
                    styles: [".gantt-footer { background-color: whitesmoke; height: 36px; border-top: 1px solid #e0e0e0; } .gantt-footer-actions { float:right; } "]
                },] },
    ];
    /** @nocollapse */
    GanttFooterComponent.ctorParameters = function () { return []; };
    GanttFooterComponent.propDecorators = {
        "project": [{ type: core.Input },],
    };
    return GanttFooterComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttActivityBackgroundComponent = (function () {
    function GanttActivityBackgroundComponent(ganttService) {
        var _this = this;
        this.ganttService = ganttService;
        this.onChanges = new core.EventEmitter();
        this.cells = [];
        this.onChanges.subscribe(function () { return _this.drawGrid(); });
    }
    Object.defineProperty(GanttActivityBackgroundComponent.prototype, "tasks", {
        get: /**
         * @return {?}
         */
        function () {
            return this._tasks;
        },
        set: /**
         * @param {?} tasks
         * @return {?}
         */
        function (tasks) {
            if (!lodash.isNil(tasks) && lodash.isObject(tasks) && !lodash.isEqual(tasks, this._tasks)) {
                this._tasks = tasks;
                this.onChanges.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    GanttActivityBackgroundComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.drawGrid();
        this.zoom.subscribe(function (zoomLevel) {
            _this.zoomLevel = zoomLevel;
            _this.drawGrid();
        });
    };
    /**
     * @param {?} date
     * @return {?}
     */
    GanttActivityBackgroundComponent.prototype.isDayWeekend = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return this.ganttService.isDayWeekend(date);
    };
    /**
     * @return {?}
     */
    GanttActivityBackgroundComponent.prototype.setRowStyle = /**
     * @return {?}
     */
    function () {
        return {
            'height': this.ganttService.rowHeight + 'px'
        };
    };
    /**
     * @return {?}
     */
    GanttActivityBackgroundComponent.prototype.setCellStyle = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ width = this.ganttService.cellWidth;
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth;
        }
        return {
            'width': width + 'px'
        };
    };
    /**
     * @return {?}
     */
    GanttActivityBackgroundComponent.prototype.drawGrid = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            this.cells = [];
            this.timeScale.forEach(function (date) {
                for (var /** @type {?} */ i = 0; i <= 23; i++) {
                    _this.cells.push(date);
                }
            });
        }
        else {
            this.cells = this.timeScale;
        }
    };
    GanttActivityBackgroundComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-activity-background',
                    template: "<div #bg class=\"gantt_activity_bg\"> <div class=\"gantt_activity_row\" [ngStyle]=\"setRowStyle()\" *ngFor=\"let row of ganttService.groupData(tasks)\"> <div class=\"gantt_activity_cell\" [ngStyle]=\"setCellStyle()\" *ngFor=\"let cell of cells; let l = last\" [ngClass]=\"[(isDayWeekend(cell)) ? 'weekend' : '', l ? 'last_column_cell' : '']\"> </div> </div> </div> ",
                    styles: [".gantt_activity_bg { overflow: hidden; } .gantt_activity_row { border-bottom: 1px solid #ebebeb; background-color: #fff; box-sizing: border-box; } .gantt_activity_cell { display: inline-block; height: 100%; border-right: 1px solid #ebebeb; } .weekend { background-color:whitesmoke; } "]
                },] },
    ];
    /** @nocollapse */
    GanttActivityBackgroundComponent.ctorParameters = function () { return [
        { type: GanttService, },
    ]; };
    GanttActivityBackgroundComponent.propDecorators = {
        "tasks": [{ type: core.Input },],
        "timeScale": [{ type: core.Input },],
        "zoom": [{ type: core.Input },],
        "zoomLevel": [{ type: core.Input },],
        "bg": [{ type: core.ViewChild, args: ['bg',] },],
    };
    return GanttActivityBackgroundComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttActivityBarsComponent = (function () {
    function GanttActivityBarsComponent(ganttService) {
        this.ganttService = ganttService;
        this.containerHeight = 0;
        this.containerWidth = 0;
        this.resizeable = '';
        this.resizeable = (this.ganttService.barResizeable) ? 'resizeable' : '';
    }
    /**
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.containerHeight = this.dimensions.height;
        this.containerWidth = this.dimensions.width;
        this.zoom.subscribe(function (zoomLevel) {
            _this.zoomLevel = zoomLevel;
        });
    };
    // TODO(dale): the ability to move bars needs reviewing and there are a few quirks
    /**
     * @param {?} $event
     * @param {?} bar
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.expandLeft = /**
     * @param {?} $event
     * @param {?} bar
     * @return {?}
     */
    function ($event, bar) {
        $event.stopPropagation();
        var /** @type {?} */ ganttService = this.ganttService;
        var /** @type {?} */ startX = $event.clientX;
        var /** @type {?} */ startBarWidth = bar.style.width;
        var /** @type {?} */ startBarLeft = bar.style.left;
        /**
         * @param {?} e
         * @return {?}
         */
        function doDrag(e) {
            var /** @type {?} */ cellWidth = ganttService.cellWidth;
            var /** @type {?} */ barWidth = startBarWidth - e.clientX + startX;
            var /** @type {?} */ days = Math.round(barWidth / cellWidth);
            bar.style.width = days * cellWidth + days;
            bar.style.left = (startBarLeft - (days * cellWidth) - days);
        }
        this.addMouseEventListeners(doDrag);
        return false;
    };
    /**
     * @param {?} $event
     * @param {?} bar
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.expandRight = /**
     * @param {?} $event
     * @param {?} bar
     * @return {?}
     */
    function ($event, bar) {
        $event.stopPropagation();
        var /** @type {?} */ ganttService = this.ganttService;
        var /** @type {?} */ startX = $event.clientX;
        var /** @type {?} */ startBarWidth = bar.style.width;
        var /** @type {?} */ startBarEndDate = bar.task.end;
        var /** @type {?} */ startBarLeft = bar.style.left;
        /**
         * @param {?} e
         * @return {?}
         */
        function doDrag(e) {
            var /** @type {?} */ cellWidth = ganttService.cellWidth;
            var /** @type {?} */ barWidth = startBarWidth + e.clientX - startX;
            var /** @type {?} */ days = Math.round(barWidth / cellWidth);
            if (barWidth < cellWidth) {
                barWidth = cellWidth;
                days = Math.round(barWidth / cellWidth);
            }
            bar.style.width = ((days * cellWidth) + days); // rounds to the nearest cell
        }
        this.addMouseEventListeners(doDrag);
        return false;
    };
    /**
     * @param {?} $event
     * @param {?} bar
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.move = /**
     * @param {?} $event
     * @param {?} bar
     * @return {?}
     */
    function ($event, bar) {
        $event.stopPropagation();
        var /** @type {?} */ ganttService = this.ganttService;
        var /** @type {?} */ startX = $event.clientX;
        var /** @type {?} */ startBarLeft = bar.style.left;
        /**
         * @param {?} e
         * @return {?}
         */
        function doDrag(e) {
            var /** @type {?} */ cellWidth = ganttService.cellWidth;
            var /** @type {?} */ barLeft = startBarLeft + e.clientX - startX;
            var /** @type {?} */ days = Math.round(barLeft / cellWidth);
            // TODO: determine how many days the bar can be moved
            // if (days < maxDays) {
            bar.style.left = ((days * cellWidth) + days); // rounded to nearest cell
            // keep bar in bounds of grid
            if (barLeft < 0) {
                bar.style.left = 0;
            }
            // }
            // TODO: it needs to take into account the max number of days.
            // TODO: it needs to take into account the current days.
            // TODO: it needs to take into account the right boundary.
        }
        this.addMouseEventListeners(doDrag);
        return false;
    };
    /**
     * @param {?} task
     * @param {?} index
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.drawBar = /**
     * @param {?} task
     * @param {?} index
     * @return {?}
     */
    function (task, index) {
        var /** @type {?} */ style = {};
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            style = this.ganttService.calculateBar(task, index, this.timeScale, true);
        }
        else {
            style = this.ganttService.calculateBar(task, index, this.timeScale);
        }
        return style;
    };
    /**
     * @param {?} task
     * @param {?} bar
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.drawProgress = /**
     * @param {?} task
     * @param {?} bar
     * @return {?}
     */
    function (task, bar) {
        var /** @type {?} */ barStyle = this.ganttService.getBarProgressStyle(task.status);
        var /** @type {?} */ width = this.ganttService.calculateBarProgress(this.ganttService.getComputedStyle(bar, 'width'), task.percentComplete);
        return {
            'width': width,
            'background-color': barStyle['background-color'],
        };
    };
    /**
     * @param {?} dragFn
     * @return {?}
     */
    GanttActivityBarsComponent.prototype.addMouseEventListeners = /**
     * @param {?} dragFn
     * @return {?}
     */
    function (dragFn) {
        /**
         * @return {?}
         */
        function stopFn() {
            document.documentElement.removeEventListener('mousemove', dragFn, false);
            document.documentElement.removeEventListener('mouseup', stopFn, false);
            document.documentElement.removeEventListener('mouseleave', stopFn, false);
        }
        document.documentElement.addEventListener('mousemove', dragFn, false);
        document.documentElement.addEventListener('mouseup', stopFn, false);
        document.documentElement.addEventListener('mouseleave', stopFn, false);
    };
    GanttActivityBarsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-activity-bars',
                    template: "<div class=\"gantt_activity_bars_area\" [ngStyle]=\"{ 'height': containerHeight + 'px', 'width': containerWidth + 'px' }\"> <div #bar class=\"gantt_activity_line\" *ngFor=\"let task of ganttService.groupData(tasks); let i = index\" [ngStyle]=\"drawBar(task, i)\"> <div class=\"gantt_activity_progress\" [ngStyle]=\"drawProgress(task, bar)\"></div> <div class=\"gantt_activity_progress_drag\" style=\"left: 518px\"></div> <div class=\"gantt_activity_content\"></div> <div class=\"gantt_activity_link_control gantt_activity_right {{ resizable }}\" style=\"height: 26px; line-height: 30px\"> <div class=\"gantt_link_point\"></div> </div> <div class=\"gantt_activity_link_control gantt_activity_left {{ resizable }}\" style=\"height: 26px; line-height: 30px\"> <div class=\"gantt_link_point\"></div> </div> </div> </div> ",
                    styles: [".gantt_activity_line { /*border-radius: 2px;*/ position: absolute; box-sizing: border-box; background-color: rgb(18,195,244); border: 1px solid #2196F3; -webkit-user-select: none; } .gantt_activity_line:hover { /*cursor: move;*/ } .gantt_activity_progress { text-align: center; z-index: 0; background: #2196F3; position: absolute; min-height: 18px; display: block; height: 18px; } .gantt_activity_progress_drag { height: 8px; width: 8px; bottom: -4px; margin-left: 4px; background-position: bottom; background-image: \"\"; background-repeat: no-repeat; z-index: 2; } .gantt_activity_content { font-size: 12px; color: #fff; width: 100%; top: 0; position: absolute; white-space: nowrap; text-align: center; line-height: inherit; overflow: hidden; height: 100%; } .gantt_activity_link_control { position: absolute; width: 13px; top: 0; } .gantt_activity_right { right: 0; } .gantt_activity_left { left: 0; } .gantt_activity_right.resizable:hover { cursor:w-resize; } .gantt_activity_left.resizable:hover { cursor:w-resize; } "]
                },] },
    ];
    /** @nocollapse */
    GanttActivityBarsComponent.ctorParameters = function () { return [
        { type: GanttService, },
    ]; };
    GanttActivityBarsComponent.propDecorators = {
        "timeScale": [{ type: core.Input },],
        "dimensions": [{ type: core.Input },],
        "tasks": [{ type: core.Input },],
        "zoom": [{ type: core.Input },],
        "zoomLevel": [{ type: core.Input },],
    };
    return GanttActivityBarsComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttTimeScaleComponent = (function () {
    function GanttTimeScaleComponent(ganttService) {
        this.ganttService = ganttService;
    }
    /**
     * @return {?}
     */
    GanttTimeScaleComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.zoom.subscribe(function (zoomLevel) {
            _this.zoomLevel = zoomLevel;
        });
    };
    /**
     * @return {?}
     */
    GanttTimeScaleComponent.prototype.setTimescaleStyle = /**
     * @return {?}
     */
    function () {
        return {
            'width': this.dimensions.width + 'px'
        };
    };
    /**
     * @param {?} borderTop
     * @return {?}
     */
    GanttTimeScaleComponent.prototype.setTimescaleLineStyle = /**
     * @param {?} borderTop
     * @return {?}
     */
    function (borderTop) {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative',
            'border-top': borderTop
        };
    };
    /**
     * @return {?}
     */
    GanttTimeScaleComponent.prototype.setTimescaleCellStyle = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ width = this.ganttService.cellWidth;
        var /** @type {?} */ hoursInDay = 24;
        var /** @type {?} */ hourSeperatorPixels = 23; // we don't include the first
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth * hoursInDay + hourSeperatorPixels;
        }
        return {
            'width': width + 'px'
        };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    GanttTimeScaleComponent.prototype.isDayWeekend = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return this.ganttService.isDayWeekend(date);
    };
    /**
     * @return {?}
     */
    GanttTimeScaleComponent.prototype.getHours = /**
     * @return {?}
     */
    function () {
        if (!lodash.isNil(this.timeScale) && 'length' in this.timeScale) {
            return this.ganttService.getHours(this.timeScale.length);
        }
    };
    GanttTimeScaleComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'gantt-time-scale',
                    template: "<div class=\"time_scale\" [ngStyle]=\"setTimescaleStyle()\"> <div class=\"time_scale_line\" [ngStyle]=\"setTimescaleLineStyle('none')\"> <div class=\"time_scale_cell\" *ngFor=\"let date of timeScale\" [ngStyle]=\"setTimescaleCellStyle()\" [ngClass]=\"(isDayWeekend(date)) ? 'weekend' : ''\">{{date | date: 'dd-MM-yyyy'}}</div> </div> <div *ngIf=\"zoomLevel === 'hours'\" class=\"time_scale_line\" [ngStyle]=\"setTimescaleLineStyle('1px solid #cecece')\"> <div class=\"time_scale_cell\" *ngFor=\"let hour of getHours()\" [ngStyle]=\"{ 'width': ganttService.hourCellWidth + 'px' }\">{{hour}}</div> </div> </div> ",
                    styles: [".weekend { background-color: whitesmoke; } .time_scale { font-size: 12px; border-bottom: 1px solid #cecece; background-color: #fff; } .time_scale_line { box-sizing: border-box; } .time_scale_line:first-child { border-top: none; } .time_scale_cell { display: inline-block; white-space: nowrap; overflow: hidden; border-right: 1px solid #cecece; text-align: center; height: 100%; } "]
                },] },
    ];
    /** @nocollapse */
    GanttTimeScaleComponent.ctorParameters = function () { return [
        { type: GanttService, },
    ]; };
    GanttTimeScaleComponent.propDecorators = {
        "timeScale": [{ type: core.Input },],
        "dimensions": [{ type: core.Input },],
        "zoom": [{ type: core.Input },],
        "zoomLevel": [{ type: core.Input },],
    };
    return GanttTimeScaleComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GanttModule = (function () {
    function GanttModule() {
    }
    /**
     * @return {?}
     */
    GanttModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: GanttModule,
            providers: [GanttService]
        };
    };
    GanttModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule
                    ],
                    declarations: [
                        GanttComponent,
                        GanttActivityComponent,
                        GanttComponent,
                        GanttHeaderComponent,
                        GanttFooterComponent,
                        GanttActivityBackgroundComponent,
                        GanttActivityBarsComponent,
                        GanttTimeScaleComponent,
                        GroupByPipe
                    ],
                    exports: [
                        GanttComponent,
                        GanttActivityComponent,
                        GanttHeaderComponent,
                        GanttFooterComponent,
                        GanttActivityBackgroundComponent,
                        GanttActivityBarsComponent,
                        GanttTimeScaleComponent,
                        GroupByPipe
                    ]
                },] },
    ];
    /** @nocollapse */
    GanttModule.ctorParameters = function () { return []; };
    return GanttModule;
}());

exports.GanttModule = GanttModule;
exports.GanttComponent = GanttComponent;
exports.GroupByPipe = GroupByPipe;
exports.GanttService = GanttService;
exports.Zooming = Zooming;

Object.defineProperty(exports, '__esModule', { value: true });

})));
