AFRAME.registerComponent('raycaster-listen', {
    init: function () {
  
      this.el.addEventListener('raycaster-intersected', evt => {
        this.raycaster = evt.detail.el;
      });
      this.el.addEventListener('raycaster-intersected-cleared', evt => {
        this.raycaster = null;
      });
    },
  
    tick: function () {
      if (!this.raycaster) { return; }  // Not intersecting.
  
      let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
      if (!intersection) { return; }
      console.log(intersection.point);
    }
  });