package com.pranav.train.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stationName;
    private String stationCode;

    public Station(String stationName, String stationCode) {
        this.stationName = stationName;
        this.stationCode = stationCode;
    }
}
