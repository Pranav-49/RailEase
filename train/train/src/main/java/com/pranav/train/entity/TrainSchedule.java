package com.pranav.train.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.sql.Time;

@Entity
public class TrainSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "train_id")
    @JsonManagedReference
    private Train train;

    @ManyToOne
    @JoinColumn(name = "source_station_id")
    private Station source;

    @ManyToOne
    @JoinColumn(name = "destination_station_id")
    private Station destination;


    private String departureTime;
    private String arrivalTime;

    public TrainSchedule(Train train, Station source, Station destination, String departureTime, String arrivalTime) {
        this.train = train;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    public long getId() {
        return id;
    }

    public Train getTrain() {
        return train;
    }

    public Station getSource() {
        return source;
    }

    public Station getDestination() {
        return destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setTrain(Train train) {
        this.train = train;
    }

    public void setSource(Station source) {
        this.source = source;
    }

    public void setDestination(Station destination) {
        this.destination = destination;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
}
