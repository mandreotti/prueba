window.ST = window.ST || {};

window.ST.initializeListingShapesOrder = function() {
  var fieldMap = $(".js-listing-shape-row").map(function(id, row) {
    var $row = $(row);
    return {
      id: $row.data("id"),
      element: $row,
      up: $row.find(".js-listing-shape-action-up"),
      down: $row.find(".js-listing-shape-action-down")
    };
  }).get();

  var orderManager = window.ST.orderManager(fieldMap);

  var ajaxRequest = orderManager.order.changes().debounce(800).map(".order")
    .skipDuplicates(_.isEqual)
    .map(function(order) {
    return {
      type: "POST",
      url: ST.utils.relativeUrl("order"),
      data: { order: order }
    };
  });

  var ajaxResponse = ajaxRequest.ajax();
  var ajaxStatus = window.ST.ajaxStatusIndicator(ajaxRequest, ajaxResponse);

  ajaxStatus.loading.onValue(function() {
    $(".js-listing-shape-ajax-saving").show();
    $(".js-listing-shape-ajax-error").hide();
    $(".js-listing-shape-ajax-success").hide();
  });

  ajaxStatus.success.onValue(function() {
    $(".js-listing-shape-ajax-saving").hide();
    $(".js-listing-shape-ajax-success").show();
  });

  ajaxStatus.error.onValue(function() {
    $(".js-listing-shape-ajax-saving").hide();
    $(".js-listing-shape-ajax-error").show();
  });

  ajaxStatus.idle.onValue(function() {
    $(".js-listing-shape-ajax-success").fadeOut();
  });
};

window.ST.initializeListingShapeForm = function(formId) {
  $(formId).validate({
    errorPlacement: function(error, element) {
      if (element.hasClass("js-custom-unit-kind-radio")) {
        error.appendTo($(".js-custom-unit-kind-container"));
      } else {
        error.insertAfter(element);
      }
    }
  });

  var priceChanged = function(currentEl) {
    var enabled = currentEl.is(':checked');
    if(enabled) {
      toggleOnlinePaymentEnabled(true);
      toggleUnitsEnabled(true);
    } else {
      toggleOnlinePaymentEnabled(false);
      toggleShippingEnabled(false);
      toggleUnitsEnabled(false);
    }
  };

  var onlinePaymentsChanged = function(currentEl) {
    var enabled = currentEl.is(':checked');
    if(enabled) {
      toggleAvailabilityEnabled(true);
      toggleShippingEnabled(true);
    } else {
      toggleAvailabilityEnabled(false);
      toggleShippingEnabled(false);
    }
  };

  var availabilityChanged = function(currentEl) {
    var enabled = currentEl.is(':checked');
    if(enabled) {
      toggleAvailabilityUnitsEnabled(true);
      toggleUnitsEnabled(false);
    } else {
      toggleAvailabilityUnitsEnabled(false)
      toggleUnitsEnabled(true);
    }
  }

  var toggleOnlinePaymentEnabled = function(enabled) {
    toggleCheckbox($(".js-online-payments"), enabled);
    toggleLabel($(".js-online-payments-label"), enabled);
  };

  var toggleShippingEnabled = function(enabled) {
    toggleCheckbox($(".js-shipping-enabled"), enabled);
    toggleLabel($(".js-shipping-enabled-label"), enabled);
  };

  var toggleUnitsEnabled = function(enabled) {
    toggleCheckbox($(".js-unit-checkbox"), enabled);
    toggleLabel($(".js-unit-label"), enabled);
    toggleInfo($('.js-pricing-units-info'), enabled);
  };

  var toggleAvailabilityEnabled = function(enabled) {
    toggleCheckbox($(".js-availability"), enabled);
    toggleLabel($(".js-availability-label"), enabled);
  };

  var toggleAvailabilityUnitsEnabled = function(enabled) {
    toggleRadio($(".js-availability-unit"), enabled);
    toggleLabel($(".js-availability-unit-label"), enabled);
    toggleInfo($('.js-pricing-units-disabled-info'), enabled)
  };

  var removeCustomUnit = function() {
    var index = $(this).data("customunitindex");
    if (typeof index !== "undefined") {
      $('.js-custom-unit-' + index).remove();
    }
  };

  var customUnitTemplate = _.template($(".js-listing-shape-add-custom-unit-form").html());

  var addCustomUnitForm = function() {
    var uniqueId = _.uniqueId('new_unit-');

    var $form = $(customUnitTemplate({uniqueId: uniqueId}));

    $form.find('.js-listing-shape-close-custom-unit-form').click(closeCustomUnitForm);
    $form.insertBefore($('.js-listing-shape-add-custom-unit-link').parent()).show();
  };

  var closeCustomUnitForm = function() {
    this.parentElement.remove();
  };

  var toggleCheckbox = function(el, state) {
    if(state) {
      el.prop('disabled', false);
    } else {
      el.prop('disabled', true);
      el.prop('checked', false);
    }
  };

  var toggleRadio = function(el, state) {
    if(state) {
      el.prop('disabled', false);

      // Check the first one if none of the radiobuttons is checked
      if (!el.is(":checked")) {
        el.first().prop('checked', true);
      }
    } else {
      el.prop('disabled', true);
      el.prop('checked', false);
    }
  };

  var toggleInfo = function(el, state) {
    if (state) {
      el.show();
    } else {
      el.hide();
    }
  };

  var toggleLabel = function(el, state) {
    el.toggleClass("listing-shape-label-disabled", !state);
  };

  $('.js-price-enabled').change(function() {
    priceChanged($(this));
  });
  $('.js-online-payments').change(function() {
    onlinePaymentsChanged($(this));
  });
  $('.js-listing-shape-add-custom-unit-link').click(function() {
    addCustomUnitForm();
  });
  $('.js-availability').click(function() {
    availabilityChanged($(this));
  });

  $('.js-listing-shape-close-custom-unit-form').click(closeCustomUnitForm);
  $('.js-remove-custom-unit').click(removeCustomUnit);

  // Run once on init
  priceChanged($('.js-price-enabled'));
  onlinePaymentsChanged($('.js-online-payments'));
  availabilityChanged($('.js-availability'));
};
