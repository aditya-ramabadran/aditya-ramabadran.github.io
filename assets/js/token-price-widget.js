(function () {
  var widgets = document.querySelectorAll("[data-effort-widget]");

  if (!widgets.length) return;

  widgets.forEach(function (widget) {
    var fallback = widget.querySelector("[data-effort-widget-fallback]");
    var ui = widget.querySelector("[data-effort-widget-ui]");
    var slider = widget.querySelector("[data-effort-slider]");
    var value = widget.querySelector("[data-effort-value]");
    var state = widget.querySelector("[data-effort-state]");
    var benefitCurve = widget.querySelector("[data-benefit-curve]");
    var priceLine = widget.querySelector("[data-price-line]");
    var priceLabel = widget.querySelector("[data-price-label]");
    var lengthGuide = widget.querySelector("[data-length-guide]");
    var intersection = widget.querySelector("[data-intersection]");
    var intersectionHalo = widget.querySelector("[data-intersection-halo]");
    var lengthLabel = widget.querySelector("[data-length-label]");

    if (!ui || !slider || !benefitCurve || !priceLine || !intersection) return;

    var xMin = 118;
    var xMax = 620;
    var yMin = 76;
    var yMax = 326;
    var decay = 3;
    var curveFloor = Math.exp(-decay);

    function curveY(t) {
      var benefit = Math.exp(-decay * t);
      return yMin + ((1 - benefit) / (1 - curveFloor)) * (yMax - yMin);
    }

    function buildCurve() {
      var points = [];

      for (var index = 0; index <= 64; index += 1) {
        var t = index / 64;
        var x = xMin + (xMax - xMin) * t;
        var y = curveY(t);
        points.push((index ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2));
      }

      benefitCurve.setAttribute("d", points.join(" "));
    }

    function qualitativeState(effort) {
      if (effort < 34) return "larger penalty · shorter trace";
      if (effort > 67) return "smaller penalty · longer trace";
      return "medium penalty · medium trace";
    }

    function update() {
      var effort = Number(slider.value);
      var t = (effort - 1) / 99;
      var x = xMin + (xMax - xMin) * t;
      var y = curveY(t);
      var currentState = qualitativeState(effort);

      value.textContent = String(effort);
      state.textContent = currentState;
      slider.setAttribute("aria-valuetext", effort + ", " + currentState.replace(" · ", " and "));

      priceLine.setAttribute("y1", y.toFixed(2));
      priceLine.setAttribute("y2", y.toFixed(2));
      priceLabel.setAttribute("y", Math.max(54, y - 12).toFixed(2));

      lengthGuide.setAttribute("x1", x.toFixed(2));
      lengthGuide.setAttribute("x2", x.toFixed(2));
      lengthGuide.setAttribute("y1", y.toFixed(2));

      intersection.setAttribute("cx", x.toFixed(2));
      intersection.setAttribute("cy", y.toFixed(2));
      intersectionHalo.setAttribute("cx", x.toFixed(2));
      intersectionHalo.setAttribute("cy", y.toFixed(2));

      lengthLabel.setAttribute("x", x.toFixed(2));
    }

    buildCurve();
    update();
    slider.addEventListener("input", update);

    if (fallback) fallback.hidden = true;
    ui.hidden = false;
  });
}());
