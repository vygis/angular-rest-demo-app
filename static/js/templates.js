angular.module('app.templates', ['advertiser-details.tpl.html', 'advertiser-list.tpl.html', 'dialogs/advertiser-delete.tpl.html', 'dialogs/advertiser-new.tpl.html', 'dialogs/pixel-new.tpl.html', 'navbar.tpl.html', 'pixel-details.tpl.html']);

angular.module("advertiser-details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("advertiser-details.tpl.html",
    "<div ng-controller=\"advertiserDetailsCtrl\">\n" +
    "    <div class=\"alert alert-success\" ng-show=\"status == 'success'\">{{confirmationMessage}}<span class=\"pull-right glyphicon glyphicon-ok\" ng-click=\"removeConfirmation()\"></span></div>\n" +
    "    <div class=\"alert alert-danger\" ng-show=\"status == 'error'\">{{confirmationMessage}}<span class=\"pull-right glyphicon glyphicon-remove\" ng-click=\"removeConfirmation()\"></span></div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <h4>Advertiser Details</h4>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Name</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advertiser.name\" ng-disabled=\"!editMode\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">City</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advertiser.city\" ng-disabled=\"!editMode\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Address</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advertiser.address\" ng-disabled=\"!editMode\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Postcode</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advertiser.post_code\" ng-disabled=\"!editMode\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Tel. no.</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advertiser.tel\" ng-disabled=\"!editMode\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <hr/>\n" +
    "            <div class=\"pull-left\">\n" +
    "                <button type=\"button\" class=\"btn btn-s btn-danger\" ng-show=\"!editMode\" ng-click=\"deleteAdvertiser()\">delete</button>\n" +
    "                <button type=\"button\" class=\"btn btn-s\" ng-show=\"!editMode\" ng-click=\"toggleEdit()\">edit</button>\n" +
    "                <button type=\"button\" class=\"btn btn-s\" ng-show=\"editMode\" ng-click=\"toggleEdit()\">cancel</button>\n" +
    "                <button type=\"button\" class=\"btn btn-s btn-primary\" ng-show=\"editMode\" ng-click=\"saveChanges()\">Save</button>\n" +
    "            </div>\n" +
    "            <div class=\"pull-right\">\n" +
    "                <button type=\"button\" class=\"btn btn-s btn-primary\" ng-show=\"!editMode\" ng-click=\"newPixel()\">new pixel</button>\n" +
    "            </div>\n" +
    "            <div class=\"clearfix\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <h4>Pixels:</h4>\n" +
    "            <br/>\n" +
    "            <div class=\"alert alert-info\" ng-show=\"pixels.length == 0\">\n" +
    "                No pixels\n" +
    "            </div>\n" +
    "            <ul class=\"list-group\" ng-if=\"pixels.length > 0\">\n" +
    "                <li class=\"list-group-item col-l-6\" ng-repeat=\"pixel in pixels\">\n" +
    "                    <a ui-sref=\"pixelDetails({ adId: advertiser.id, pixId: pixel.id })\">{{pixel.name}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("advertiser-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("advertiser-list.tpl.html",
    "<div class=\"col-xs-12\" ng-controller=\"advertiserListCtrl\">\n" +
    "    <div class=\"alert alert-success\" ng-show=\"status == 'success'\">{{confirmationMessage}}<span class=\"pull-right glyphicon glyphicon-ok\" ng-click=\"removeConfirmation()\"></span></div>\n" +
    "    <div class=\"pull-right\">\n" +
    "        <h4 class=\"custom-margin\"><button type=\"button\" class=\"btn btn-s btn-primary\" ng-click=\"newAdvertiser()\">New Advertiser</button></h4>\n" +
    "    </div>\n" +
    "    <div class=\"clearfix\"></div>\n" +
    "    <div class=\"col-sm-6 col-md-3\" ng-repeat=\"advertiser in advertisers\">\n" +
    "        <div class=\"thumbnail\">\n" +
    "            <div class=\"caption\">\n" +
    "                <h3><a ui-sref=\"advertiserDetails({ id: advertiser.id })\">{{advertiser.name}}</a></h3>\n" +
    "                <p>{{advertiser.city}}</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("dialogs/advertiser-delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dialogs/advertiser-delete.tpl.html",
    "<form name=\"form\" class=\"form-horizontal\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4>Delete '{{advertiserName}}'?</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"alert alert-danger\" ng-show=\"status == 'error'\">{{errorMsg}}</div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-8\">\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4\">\n" +
    "                <button class=\"btn cancel\" ng-click=\"cancel()\">No</button>\n" +
    "                <button class=\"btn btn-danger login\" ng-click=\"submit()\" ng-disabled='form.$invalid'>Yes</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("dialogs/advertiser-new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dialogs/advertiser-new.tpl.html",
    "<form name=\"form\" class=\"form-horizontal\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h4>Create a new advertiser</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"alert alert-danger\" ng-show=\"status == 'error'\">{{errorMsg}}</div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"name\" class=\"col-sm-2 control-label\">Name</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"name\" name=\"name\" class=\"form-control\" type=\"text\" ng-model=\"advertiser.name\" required autofocus>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"city\" class=\"col-sm-2 control-label\">City</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"city\" name=\"city\" class=\"form-control\" type=\"text\" ng-model=\"advertiser.city\" required autofocus>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"address\" class=\"col-sm-2 control-label\">Address</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input name=\"address\" id=\"address\" class=\"form-control\" type=\"address\" ng-model=\"advertiser.address\" required autofocus>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"post_code\" class=\"col-sm-2 control-label\">Postcode</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"post_code\" name=\"post_code\" class=\"form-control\" type=\"text\" ng-model=\"advertiser.post_code\" required autofocus>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"tel\" class=\"col-sm-2 control-label\">Tel. no.</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input name=\"tel\" id=\"tel\" class=\"form-control\" type=\"tel\" ng-model=\"advertiser.tel\" required autofocus>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn cancel\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        <button class=\"btn btn-primary login\" ng-click=\"submit()\" ng-disabled='form.$invalid'>Create</button>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("dialogs/pixel-new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dialogs/pixel-new.tpl.html",
    "<form name=\"form\" class=\"form-horizontal\" novalidate>\n" +
    "    <div class=\"modal-header\">\n" +
    "    <h4>Create a new pixel</h4>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"alert alert-danger\" ng-show=\"status == 'error'\">{{errorMsg}}</div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-8\">\n" +
    "                <input id=\"pixelName\" placeholder=\"Pixel name\" name=\"pixelName\" class=\"form-control\" type=\"text\" ng-model=\"pixel.name\" required autofocus>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4\">\n" +
    "                <button class=\"btn cancel\" ng-click=\"cancel()\">Cancel</button>\n" +
    "                <button class=\"btn btn-primary login\" ng-click=\"submit()\" ng-disabled='form.$invalid'>Create</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("navbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("navbar.tpl.html",
    "<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\" ng-controller=\"navbarCtrl\" ng-cloak>\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <a class=\"navbar-brand\" href=\"#\">CMS</a>\n" +
    "        </div>\n" +
    "        <ul class=\"nav navbar-nav\">\n" +
    "            <li ng-class=\"{active: isActive('/advertisers')}\"><a ui-sref=\"advertiserList\">Advertisers</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</nav>");
}]);

angular.module("pixel-details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pixel-details.tpl.html",
    "<div class=\"row\" ng-controller=\"pixelDetailsCtrl\">\n" +
    "    <ol class=\"breadcrumb\">\n" +
    "        <li><a href=\"#\">Advertisers</a></li>\n" +
    "        <li><a ui-sref=\"advertiserDetails({ id: pixel.advertiser_id })\">{{pixel.advertiser_id}}</a></li>\n" +
    "        <li class=\"active\">{{pixel.name}}</li>\n" +
    "    </ol>\n" +
    "    <h4>pixel {{pixel.id}}</h4>\n" +
    "    <div class=\"alert alert-info\" ng-show=\"fires === null\">\n" +
    "        No pixels fires\n" +
    "    </div>\n" +
    "    <ul class=\"list-group\" ng-if=\"fires.length > 0\">\n" +
    "        <li class=\"list-group-item col-l-6\" ng-repeat=\"fire in fires\">\n" +
    "            <p>{{fire.fires}} hits on {{formatDate(fire.date)}}</p>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);
