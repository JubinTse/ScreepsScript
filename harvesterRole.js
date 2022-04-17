module.exports = {
    run: function (creep) {

        /**
         * 统计地图资源
         * sources              地图物资
         * sources1Harvesters   资源点1号工作人数
         * sources2Harvesters   资源点2号工作人数
         */
        var sources = creep.room.find(FIND_SOURCES);
        var sources1Harvesters = _.filter(
            _.filter(
                creep.room.lookAtArea(sources[0].pos.y - 2, sources[0].pos.x - 2, sources[0].pos.y + 2, sources[0].pos.x + 2, true),
                (s) => s.type == 'creep'),
            (s) => s.creep.memory.role == 'harvester1');
        var sources2Harvesters = _.filter(
            _.filter(
                creep.room.lookAtArea(sources[1].pos.y - 2, sources[1].pos.x - 2, sources[1].pos.y + 2, sources[1].pos.x + 2, true),
                (s) => s.type == 'creep'),
            (s) => s.creep.memory.role == 'harvester2');

        /**
         * 根据creep身上可用空间及地图资源数量分配角色
         */

        if (sources1Harvesters.length < 2 && creep.memory.role != 'harvester2') {
            creep.memory.role = 'harvester1'
        } else {
            creep.memory.role = 'harvester2'
        }

        /**
         * 根据角色分配工作
         */
        if (creep.memory.role == 'harvester1') {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                creep.say('⛏️采礦');
            }
        } else if (creep.memory.role == 'harvester2') {
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
                creep.say('⛏️采礦');
            }
        }
    }
}